# -*- coding: utf-8 -*-
"""
Created on Wed Nov  6 11:05:47 2019

Class for using GDAL and OGR to clip a raster.
These are the input parameters necessary for utilizing the object. See Example below

from raster_clip import TerraClip

inR = r"C:\meris_rasters\ESACCI_300m_2010.tif"
outR = r"C:\work\clip_meris.tif"
inShp = r"V:\Data\SpatialReallocation\dasymetric_statistics\bd_2011_geo2_orig.shp"
r = TerraClip(inR, inShp, outR)
r.Clip()
r.OutputGeoIDSasTIFF(r"c:\work\bang_ids.tif", "geoid")
del r

@author: dahaynes
"""






class Clip(object):
    
    def __init__(self, inRasterPath, shapefilePath, outRasterPath, rasterBand=1, rasterType="GTiff"):
        '''This class is dependant on the osgeo gdal/ogr packages and numpy. To initiate the class you need to supply the following '''
        from osgeo import gdal, ogr
        import numpy as np
        self.gdal = gdal
        self.ogr = ogr        
        self.np = np

        self.inRaster = inRasterPath
        self.outPath = outRasterPath
        self.shapePath = shapefilePath
        self.rasterBand = rasterBand
        self.rasterType = rasterType
        

    def clip_raster(self):
        self.DetermineProjection()
        self.MakeRaster()
        self.GetRasterizedPolygon()
        self.ClipRaster()
        return self.outPath

    def world2Pixel(self, x, y):
      """
      Uses a gdal geomatrix (gdal.GetGeoTransform()) to calculate
      the pixel location of a geospatial coordinate
      """
      
      ulX = self.geoTrans[0]
      ulY = self.geoTrans[3]
      xDist = self.geoTrans[1]
      yDist = self.geoTrans[5]
      rtnX = self.geoTrans[2]
      rtnY = self.geoTrans[4]
      pixel = int((x - ulX) / xDist)
      line = int((ulY - y) / xDist)
      return (pixel, line)
       
    
    def MakeRaster(self,):
        """
        This Function will make a raster dataset and return the gdal raster object
        """
        
        #Specify the driver name of the raster 
        #All available types http://www.gdal.org/formats_list.html
        rast = self.gdal.GetDriverByName(self.rasterType)
        #Create raster with specific dimensions        
        self.OutRaster = rast.Create(self.outPath, self.pxWidth, self.pxHeight, 1, self.gdaltype)
        
        #Set the projection and spatial resolution to match the reference raster
        self.OutRaster.SetGeoTransform(self.geoTrans)
        self.OutRaster.SetProjection(self.geoProj)
        
        del rast
        
        #return RasterDataset
    
    def GetRasterizedPolygon(self,):
        '''This function takes the postgis geometry and rasterizes using the reference raster resolution, clipped the vector extent '''
        rDriver = self.gdal.GetDriverByName('MEM')
        #self.temp_tiff = '%s_tmp.tiff' % (self.outPath.split(".")[0])
        self.tiffRast = rDriver.Create('',self.pxWidth, self.pxHeight, 1, self.gdal.GDT_Float64)
        if self.tiffRast != None:
            self.tiffRast.SetGeoTransform(self.geoTrans)
            #(transformation[0], pixel_size, 0, transformation[1], 0, -pixel_size)
            self.tiffRast.SetProjection(self.geoProj)
            geometry = self.boundary.GetLayer()
            self.gdal.RasterizeLayer(self.tiffRast, [1], geometry, burn_values=[1])
        else:
            print("ERROR on creating in memory raster")
        
        
        #return memRast
    
    def DetermineProjection(self ):
        self.boundary = self.ogr.Open(self.shapePath)
        geometry = self.boundary.GetLayer()
        
        srcImage = self.gdal.Open(self.inRaster)
        self.geoTrans = srcImage.GetGeoTransform()
        self.geoProj = srcImage.GetProjection()
        band = srcImage.GetRasterBand(self.rasterBand)
        self.gdaltype = band.DataType
    
        # Convert the layer extent to image pixel coordinates
        minX, maxX, minY, maxY = geometry.GetExtent()
        ulX, ulY = self.world2Pixel(minX, maxY)
        lrX, lrY = self.world2Pixel(maxX, minY)
    
        # Calculate the pixel size of the new image
        self.pxWidth = int(lrX - ulX)
        self.pxHeight = int(lrY - ulY)
        self.xoffset =  ulX
        self.yoffset =  ulY
        
        # Adjust the bounding box to the proper extent
        self.geoTrans = list(self.geoTrans)
        self.geoTrans[0] = minX
        self.geoTrans[3] = maxY
        
        del srcImage

    def ClipRaster(self,):
        '''This function clips a Raster '''
         
        #Get Source Raster (GDAL Type)
        srcImage = self.gdal.Open(self.inRaster)
        srcBand = srcImage.GetRasterBand(self.rasterBand)
        
        #Get the band of the outraster
        band = self.OutRaster.GetRasterBand(1)
        #Needs to be changed to match that of the source raster -----
        band.SetNoDataValue(-99)
        
        #Get Rasterized Polygon
        polyband = self.tiffRast.GetRasterBand(1)
            
        #Loop through the raster row by row
        for row in range(0, self.pxHeight):    
            
            srcArray = srcBand.ReadAsArray(self.xoffset, self.yoffset+row, self.pxWidth, 1)        
            #print "Source Raster", srcArray        
            maskArray = polyband.ReadAsArray(0,row,self.pxWidth,1)    
            #print "Raserized Polygon", maskArray            
            maskRast = self.np.ma.masked_where(maskArray==1, srcArray)
            #print "Clipped Raster", self.np.ma.filled(maskRast,)        
            band.WriteArray(srcArray,yoff=row)
            #This replaces srcArray if you want to have the maskRast values
            #self.np.ma.filled(maskRast,-99)
            #print row
        
        print("Finished clippping raster")
        srcBand.FlushCache()
        del srcImage
        return 1

    def OutputGeoIDSasTIFF(self, out_tiff_path, attribute_column):
        '''Function takes the existing shapefile used when initiating the class and allow the user to determine the attribute burned. Default uses 64Float '''
        rDriver = self.gdal.GetDriverByName('GTIFF')        
        GeoID_Rast = rDriver.Create(out_tiff_path, self.pxWidth, self.pxHeight, 1, self.gdal.GDT_Float64)
        if GeoID_Rast != None:
            GeoID_Rast.SetGeoTransform(self.geoTrans)
            GeoID_Rast.SetProjection(self.geoProj)
            
            geometry = self.boundary.GetLayer()
            layerdef = geometry.GetLayerDefn()
            layer_fields = [layerdef.GetFieldDefn(i).GetName() for i in range(layerdef.GetFieldCount())]
            
            if attribute_column in layer_fields:                
                vector_attribute = "ATTRIBUTE=%s" % (attribute_column)
                self.gdal.RasterizeLayer(GeoID_Rast, [1], geometry, options = [vector_attribute])
            else:
                print("Field name not found in shapefile: %s" % (layer_fields))
        else:
            print("ERROR on creating in memory raster")



