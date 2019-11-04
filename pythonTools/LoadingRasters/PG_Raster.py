# -*- coding: utf-8 -*-
"""
Created on Thu Oct  3 14:37:05 2019

@author: dahaynes
"""
import psycopg2

class PG_Raster():
    """

    """
    
    def __init__ (self, theEnvironment):
        """Initiates TP_RasterIngest Class. You should supply a dictionary with the following keys host, db, port, user, password"""

        #from TP_RasterErrors import TP_RasterErrors
        #self.RasterErrors = TP_RasterErrors()

        if type(theEnvironment) == dict:
            self.host = theEnvironment["host"]
            self.db = theEnvironment["database"]
            self.port = theEnvironment["port"]
            self.user = theEnvironment["user"]        
            self.password = theEnvironment["password"]
            self.geoserverHost = theEnvironment["geoserver"]
            self.CommandParser(theEnvironment["rsql"])
            
#            self.raster_table = theEnvironment["raster"]
        #print self.rasterFlags
        
            
            self.psycopg2 = psycopg2
            #self.urls = ['geoserver3.pop.umn.edu:8080', 'geoserver.terrapop.org']
            
            
        else:
            print("No dictionary loaded")

    def DoesRasterTableExist(self,p_schema, p_table):
        """ Determines if a raster already exists in the database and if it does, initiates the DropTable
        Function for deletion.

        :param p_schema:
        :param p_table:
        :return:
        """

        self.CreatePostgreSQLConnection()
        query = ''' SELECT EXISTS( SELECT * FROM information_schema.tables WHERE table_schema = '%s' AND table_name = '%s'); ''' % (p_schema, p_table)
        self.ExecuteQuery(query)
        exists = self.cur.fetchone()

        if exists[0]:
            self.DropTable(p_schema, p_table)
        else:
            self.ClosePostgreSQLConnection()

    def DoesRasterViewExist(self,p_schema, p_table):
        ''' Determines if a raster already exists in the database and if it does, initiates the DropTable
        Function for deletion.

        :param p_schema:
        :param p_table:
        :return:
        '''

        self.CreatePostgreSQLConnection()
        query = ''' SELECT EXISTS( SELECT * FROM information_schema.views WHERE table_schema = '%s' AND table_name = '%s'); ''' % (p_schema, p_table)
        print(query)
        self.ExecuteQuery(self,query)
        
        exists = self.cur.fetchone()

        if exists[0]:
            self.DropView(p_schema, p_table)
        else:
            self.ClosePostgreSQLConnection()

    def DropTable(self, p_schema, p_table):
        """

        :param p_schema:
        :param p_table:
        :return:
        """

        print('Removing table %s.%s' % (p_schema,p_table))
        query  = 'DROP table %s.%s CASCADE;' % (p_schema,p_table)
        self.cur.execute(query)
        self.pg_connection.commit()
        self.ClosePostgreSQLConnection()

    def DropView(self, p_schema, p_table):
        """

        :param p_schema:
        :param p_table:
        :return:
        """

        print('Removing view %s.%s' % (p_schema,p_table))
        query  = 'DROP view %s.%s;' % (p_schema,p_table)
        self.cur.execute(query)
        self.pg_connection.commit()
        self.ClosePostgreSQLConnection()            

    def CreatePostgreSQLConnection(self):
        """

        :return:
        """

        #import psycopg2
        conn_string = "host=%s dbname=%s port=%s user=%s password=%s " % (self.host, self.db, self.port, self.user, self.password)
        #print(conn_string)
        self.pg_connection = self.psycopg2.connect(conn_string)
        self.cur = self.pg_connection.cursor()
        
    
    def ExecuteQuery(self,theQuery):
        """
        
        """
        try:
            self.cur.execute(theQuery)
        except:
            print(theQuery)
        

    def ClosePostgreSQLConnection(self):
        """

        :return:
        """
        self.cur.close()
        self.pg_connection.close()
        
            
    def CreateGeoserverDatasets(self, geoserver_dict, geoserver_workspace, geoserver_url, mnemonics_csv):
            """
            This function creates the xml datasets for the a postgresql raster table. The GeoServer class is used for
            creating the xml and posting data to geoserver.
    
            :param geoserver_workspace:
            :param geoserver_url:
            :param mnemonics_csv:
            :return:
            """
    
            from GeoServer import GeoServer
            self.geoserver_url = geoserver_url
            self.tpg = GeoServer(self.geoserver_url, geoserver_dict)
            self.geoserver_workspace = geoserver_workspace
    
            if len(mnemonics_csv) == 1:
                #  This only applies to single band rasters, exist at 1 time point
                print('Creating geoserver xml for singleband raster dataset')
    
                self.CreateMosaicTable()
                self.mnemonics = mnemonics_csv
    
                #  Making Geoserver XML files, we are assuming directory exists. Need to add a function to create a
                #  directory if it doesn't exist.
                self.MosaicXML = self.tpg.CreateMosaicXML(self.schema_mosaic_table, self.epsg)
                self.MappingXML = self.tpg.CreateMappingXML(self.schema_mosaic_table)
                self.tpg.ServerDirectory(self.schema)
                self.tpg.WriteXMLtoGeoserver(self.schema,self.MosaicXML,self.raster_table)
                self.raster_table_mapping = self.schema_mosaic_table + '.mapping'
                self.tpg.WriteXMLtoGeoserver(self.schema,self.MappingXML,self.raster_table_mapping)
    
                #  Determine if a Geoserver workspace exists
                workspace_url = r'http://%s/geoserver/rest/workspaces/%s' % (self.geoserver_url, self.geoserver_workspace)
                self.workspace_exists = self.tpg.DoesUrlExist(workspace_url)
    
                if self.workspace_exists == 404 or self.workspace_exists == 401:
                    #  Create a Geoserver Workspace
                    print('Creating new Geoserver workspace: %s' % (self.geoserver_workspace))
                    self.CreateGeoserverWorkspace()
    
                #  Create CoverageStore
                self.CreateGeoserverCoverageStore(self.raster_table)
    
                #  Create Coverage
                #  We are using minus 1 because rastestats is a list of lists.
                #
                self.CreateGeoserverCoverage(self.schema_mosaic_table, self.numbands-1, self.schema_mosaic_table)
    
                if self.geoserver_coverage_response.status_code == 500:
                    print("Error Creating singleband Raster")
                    print(self.geoserver_coverage_response.text)
                else:
                    print('Geoserver coverage for %s created from %s' % (self.mnemonics, self.raster_table))
    
#            elif self.numbands > 1:
#                print('Generating multiple views for multibanded raster')
#    
#                #  Initial cleanup and dataset (views, mosaic tables) generation
#                if type(mnemonics_csv) != list:
#                    self.CSVParser(mnemonics_csv)
#    
#                #  All views are named by <mnemonic>
#                self.CreateViewsFromMultibandRaster()
#    
#                #  All Mosaic tables are named <mnemonic>_mosaic
#                self.CreateMosaicFromMultibandRaster()
#    
#                workspace_url = r'http://%s/geoserver/rest/workspaces/%s' % (self.geoserver_url, self.geoserver_workspace)
#                #  print workspace_url
#    
#                self.tpg.ServerDirectory(self.schema)
#    
#                self.workspace_exists = self.tpg.DoesUrlExist(workspace_url)
#                if self.workspace_exists == 404 or self.workspace_exists == 401:
#                    #  Create a Geoserver Workspace
#                    print('Creating new workspace')
#                    self.CreateGeoserverWorkspace()
#    
#                if len(self.mnemonics) > 1:
#                    for bandnumber, mnemonic in enumerate(self.mnemonics):
#                        self.datasets_description = [r[2] for r in self.raster_mnemonic_description]
#                        self.data_description = self.datasets_description[bandnumber]
#    
#                        #  Create GeoSever XML files
#                        #  mnemonic = mnemonic.upper()
#                        mnemonic_xml = '%s.%s' % (self.schema, mnemonic)
#                        self.MosaicXML = self.tpg.CreateMosaicXML(mnemonic_xml, self.epsg)
#                        self.schema_mnemonic_table = '%s.%s_mosaic' % (self.schema, mnemonic)
#                        self.MappingXML = self.tpg.CreateMappingXML(self.schema_mnemonic_table)
#    
#                        #  Determine Server Directory file names
#                        self.tpg.WriteXMLtoGeoserver(self.schema,self.MosaicXML,mnemonic_xml)
#                        self.raster_table_mapping = '%s.mapping' % (mnemonic_xml)
#                        self.tpg.WriteXMLtoGeoserver(self.schema,self.MappingXML,self.raster_table_mapping)
#    
#                        # Create CoverageStore
#                        self.CreateGeoserverCoverageStore(mnemonic_xml)
#    
#                        if self.geoserver_coveragestore_response.status_code == 201 or self.geoserver_coveragestore_response.status_code == 200:
#                            #  Create Coverage
#                            self.CreateGeoserverCoverage(mnemonic, bandnumber, self.schema_mnemonic_table)
#    
#                            if self.geoserver_coverage_response.status_code == 500:
#                                print("Error", self.geoserver_coverage_response.text)
#                                a = {"prj4_text" :self.prj4_txt}
#                                b = {"Raster X size" : self.x}
#                                c = {"Raster Y size" : self.y}
#                                d = {"Raster X scale" : self.x_scale}
#                                e = {"Raster Y scale" : self.y_scale}
#    
#                                raise(self.RasterErrors.geoserver_coverage(a,b,c,d,e))
#    
#                            else:
#                                print('Geoserver coverage for band #%s: %s created from %s' % (bandnumber+1, mnemonic, self.raster_table) )
#                                #CreateStyle(self, variable_mnemonic, store_workspace)
#                        else:
#                            print("Error creating Geoserver CoverageStore")
#                            print(self.geoserver_coveragestore_response.text)
#    
#                else:
#                    print('ERROR no mnemonics, check your csv')
    
    def CreateMosaicTable(self):
            """ This function will generate the mosaic table.
    
            :return:
            """
    
            table = self.raster_table.split('.')[1]
            mosaic_table = '%s_mosaic' % (table,)
            self.DoesRasterTableExist(self.schema, mosaic_table)
            self.schema_mosaic_table = '%s.%s_mosaic' %(self.schema, table)
            #self.schema_mosaic_table comes from TP_Raster2PGSQL object.postgis_mosaic
    
            self.CreatePostgreSQLConnection()
            query  = '''create table %s(name text not null, tiletable text not null, minX FLOAT8,minY FLOAT8, maxX FLOAT8,
                                                maxY FLOAT8,resX FLOAT8, resY FLOAT8, primary key (name,tiletable));''' % (self.schema_mosaic_table)
    
            self.cur.execute(query)
            self.pg_connection.commit()
    
            'Inputs all pyramids into the mosaic table'
            for view in self.overviews:
                insert_statement = '''insert into %s(name, tiletable) values ('%s', '%s.o_%s_%s');''' % (self.schema_mosaic_table, self.schema_mosaic_table, self.schema,view,table)
                self.cur.execute(insert_statement)
                self.pg_connection.commit()
    
            'Inputs the original resolution raster into the mosaic table'
            insert_statement = '''insert into %s(name, tiletable) values ('%s', '%s');''' % (self.schema_mosaic_table,self.schema_mosaic_table,self.raster_table)
            self.cur.execute(insert_statement)
            self.pg_connection.commit()
            self.ClosePostgreSQLConnection()
    
    def CreateGeoserverWorkspace(self):
        """

        :return:
        """

        #404 for workspace that does not exist  (http://docs.geoserver.org/latest/en/user/rest/api/workspaces.html)
        #Sometime error 401 shows up, thinking it has to do with geoserver removing a directory.
        #No workspace found creating a new workspace on Geoserver
        self.workspace_XML = self.tpg.CreateWorkspaceXML(self.geoserver_workspace)
        workspace_url = r'http://%s/geoserver/rest/workspaces/' % (self.geoserver_url)
        self.geoserver_response = self.tpg.PostToGeoserver(workspace_url, self.workspace_XML)
        if self.geoserver_response.status_code ==  200 or self.geoserver_response.status_code == 201:
            pass
        else:
            print('No workspace created. Geoserver response: %s' % (self.geoserver_response.status_code))
            print(self.geoserver_response.text)

    def CreateGeoserverCoverageStore(self, tablename):
        """

        :param tablename:
        :return:
        """

        coveragestore_url = r'http://%s/geoserver/rest/workspaces/%s/coveragestores' % (self.geoserver_url, self.geoserver_workspace)

        self.coveragestore_name = tablename.split('.')[-1].upper()
        coveragestore_path =  'file:data/%s/%s.xml' % (self.schema, tablename)

        #modified coveragestore_path (file:gli/gli.fruit_har.xml)
        self.coveragestore_XML = self.tpg.CreateStoreXML(self.coveragestore_name, "Something goes here", self.geoserver_workspace,coveragestore_path)
        self.geoserver_coveragestore_response = self.tpg.PostToGeoserver(coveragestore_url,self.coveragestore_XML)

    def CreateGeoserverCoverage(self,tablename, band, schema_mosaic):
        """ Creates Coverage which automatically creates the layer.

        :param tablename:
        :param band:
        :param schema_mosaic:
        :return:
        """

        coverage_url = r'http://%s/geoserver/rest/workspaces/%s/coveragestores/%s/coverages' % (self.geoserver_url, self.geoserver_workspace, self.coveragestore_name)
        #print coverage_url
        try:
            raster_metadata = [self.prj4_txt, self.x, self.y, self.x_scale, self.y_scale]
            self.coverage_XML = self.tpg.CreateCoverageXML(self.coveragestore_name, self.geoserver_workspace, tablename, schema_mosaic, self.epsg, self.rasterstats[band], raster_metadata, self.raster_extent)
            self.geoserver_coverage_response = self.tpg.PostToGeoserver(coverage_url,self.coverage_XML)
        except:
            raise
    
    def CommandParser(self, statement):
        """

        :return:
        """

        import re
        
        self.rasterFlags = {'tilesize': {'flag': '-t', 'pattern': '-t [0-9]*x[0-9]*' ,'value': None },
                            'epsg': {'flag': '-s', 'pattern': '-s [0-9]*' ,'value': None},
                            'overviews': {'flag':'-l', 'pattern': '-l ([0-9]*,)*[0-9]*', 'value': None},
                            'vrtfile' : {'flag' : '-vrt', 'pattern' : '-vrt (\S)*', 'value': None  },
                            'postgistable' : {'flag' : '-table', 'pattern': '-table ([a-z]*.[a-z]*)', 'value': None} }
        verified = 0

        for f in self.rasterFlags:
            if self.rasterFlags[f]['flag'] in statement:
                start = statement.find(self.rasterFlags[f]['flag'])
                match = re.match(self.rasterFlags[f]['pattern'],statement[start:])
                #print f, match.group()
                self.rasterFlags[f]['value']= match.group().split(' ')[1]
                print(f, self.rasterFlags[f]['value'])

                if f == 'epsg':
                    self.epsg = self.rasterFlags['epsg']['value']
                    verified += 1
                elif f == 'overviews':
                    self.overviews = self.rasterFlags['overviews']['value'].split(',')
                    verified += 1
                elif f == 'tilesize':
                    self.tilesize = self.rasterFlags['tilesize']['value']
                    verified += 1
                elif f == 'postgistable':
                    self.raster_table = self.rasterFlags['postgistable']['value']
                    self.schema = self.raster_table.split(".")[0]
                    verified += 1
                elif f == 'vrtfile':
                    import os
                    if os.path.exists(self.rasterFlags['vrtfile']['value']):
                        self.vrt_file = self.rasterFlags['vrtfile']['value']
                        verified += 1
            else:
                print("missing flag %s" % (self.rasterFlags[f]["flag"]))
        if verified == 5:
            self.GenerateRasterStatistics()
            self.rsql = statement
            return 1
        else:
            return 0

    def UploadRaster(self,pg_host, pg_database, pg_port, pg_user):
        """ This function uploades the raster using subprocess module.

        :param pg_host:
        :param pg_database:
        :param pg_port:
        :param pg_user:
        :return:
        """

        import subprocess

        #postgis_table = self.rsql.split(' ')[-1]
        table = self.raster_table.split(".")[1]
        #self.schema, table = str(postgis_table).split('.')

        self.host = pg_host
        self.db = pg_database
        self.port = pg_port
        self.user = pg_user
        print(self.host, self.db, self.port, self.user)
        self.CreatePostgreSQLConnection()
        #self.DoesRasterSchemaExist(self.schema)
        #self.DoesRasterTableExist(self.schema, table)

        if type(self.overviews) == list:
            for view in self.overviews:
                 overview_table = 'o_%s_%s' % (view,table)
                 self.DoesRasterTableExist(self.schema, overview_table)


        print('Uploading raster')
        self.raster2pgsql = 'raster2pgsql -C -x -I -Y -F'
        aCMD = self.rsql + ' | psql -h %s -d %s -p %s -U %s' % (self.host, self.db, self.port, self.user)
        self.uploadcmd = aCMD.replace("-vrt ", "").replace("-table ", "")
        print(self.uploadcmd)
        proc = subprocess.Popen(self.uploadcmd, shell=True, bufsize=-1)
        proc.wait()

        self.status = proc.returncode
        return 'Finished uploading'
    
    def GenerateRasterStatistics(self):
        """ input vrt_file is a vrt or GeoTIFF

        :return:
        """

        print("Generating Statistics")
        from osgeo import gdal
        raster = gdal.Open(self.vrt_file)

        #Get Spatial Extent information
        from osgeo import osr
        SpatialRef = osr.SpatialReference()
        if int(self.epsg) == 4326:
            SpatialRef.ImportFromEPSG(int(self.epsg))
            self.prj4_txt = 'GEOGCS["WGS 84", DATUM["WGS_1984", SPHEROID["WGS 84", 6378137.0, 298.257223563, AUTHORITY["EPSG","7030"]], AUTHORITY["EPSG","6326"]], PRIMEM["Greenwich", 0.0], UNIT["degree", 0.017453292519943295], AXIS["Longitude", EAST], AXIS["Latitude", NORTH], AUTHORITY["EPSG","4326"]]'
        

        #self.prj4_txt = raster.GetProjection()
        #Removed divide by 2, remove multiply by 2
        self.x = raster.RasterXSize
        self.y = raster.RasterYSize
        self.geo_info = raster.GetGeoTransform()
        self.x_scale = self.geo_info[1]
        self.y_scale = self.geo_info[5]

        import subprocess
        proc = subprocess.Popen(["gdalinfo", "%s"%self.vrt_file], stdout=subprocess.PIPE)
        gdal_output,err = proc.communicate()
        self.raster_extent = self.GetRasterCorners(gdal_output.decode('utf-8'))

        self.rasterstats = []
        self.numbands = raster.RasterCount
        self.rasterstats_fields = ['min', 'max', 'mean', 'stdev', 'nodata']
        for band in range(raster.RasterCount):
            band += 1
            rast = raster.GetRasterBand(band)
            stats = rast.GetStatistics(True, True)
            nodata = rast.GetNoDataValue()
        #print nodata
        if not nodata:
            stats.extend([0])
        else:
            stats.extend([nodata])
            #            stats.extend([rast.GetNoDataValue()])
            self.rasterstats.append(stats)


        if self.numbands > 1:
            self.raster_files = raster.GetFileList()

        return

    def GetRasterCorners(self, out):
        """ Return the TopLeft and Bottom Right Corners of a raster as a list.

        :param out:
        :return:
        """

        corners = ["Upper Left", "Lower Right"]
        box = []
        for corner in corners:
            
            corner_index = out.find(corner)
            ul = out[out.find(corner):out[corner_index:].find('\n')+corner_index]
            breakers = ['(', ',', ')']
            a = []
            for b in breakers:
                a.append(ul.find(b))

            x_coord = ul[a[0]+1:a[1]]
            y_coord = ul[a[1]+2:a[2]]
            box.append(x_coord.strip())
            box.append(y_coord.strip())

        return box