# -*- coding: utf-8 -*-
"""
Created on Thu Oct  3 15:27:10 2019

@author: dahaynes
"""

from lxml import etree

def CreateMosaicXML(mosaic, epsg):
    """ This function will create the mosaic xml, which identifies the table in postgis metadata table
    for the raster.

    :param mosaic:
    :param epsg:
    :return:
    """

    #  This makes the doc string header for the mosaic xml
    docstring = '''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!DOCTYPE ImageMosaicJDBCConfig [
    	<!ENTITY mapping PUBLIC "mapping" "%s.mapping.xml">
    	<!ENTITY connect PUBLIC "connect" "../connect.postgis.xml"> 
     ]>''' % (mosaic)
    
    root = etree.Element("config", version="1.0")
    
    if 'mosaic' in mosaic:
        coverage_element2 = etree.SubElement(root, "coverageName", name='%s'%(mosaic))
    else:
        coveragename = '%s_mosaic' % (mosaic)
        coverage_element2 = etree.SubElement(root, "coverageName", name='%s'%(coveragename))
    
    cooord_element = etree.SubElement(root, "coordsys", name='EPSG:%s'%(epsg))
    scale_element = etree.SubElement(root, "scaleop", interpolation='1')
    verify_element = etree.SubElement(root, "verify", cardinality='false')
    multiline_string = '''hd\n&mapping;\n&connect;'''
    verify_element.tail = multiline_string

    #  Another wierd thing about the geosever xml that we need to clean up before it can be used
    outputxml = etree.tostring(root, doctype=docstring).decode("utf-8").replace('amp;','')

    return outputxml