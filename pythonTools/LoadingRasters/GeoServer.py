# -*- coding: utf-8 -*-
"""
Created on Thu Oct  3 14:38:15 2019

@author: dahaynes
"""

"""
Created on Tue Dec 01 09:01:39 2015
The class creates the xml necessary for generating a workspace, coveragestore, coverage, and layer with a default style.
To do this we first remotely write the mosaic and mapping xml for any dataset.
Then the mosaic xml is used to generate the coveragestore, base type of the postgis raster
Next the coverage is implemented which defines the entire dataset.
Then the layer is made for visualization purposes.
@author: dahaynes
"""

from collections import OrderedDict
import json
import paramiko
        
        
class GeoServer(object):

    def __init__(self, baseUrl, userDict):
        
        from lxml import etree
        #import paramiko as paramiko
        #import requests as requests
        from requests import post
        from requests import put
        from requests import get
        from requests import delete
        self.get = get
        self.post = post
        self.put = put
        self.delete = delete
        self.etree = etree
        self.baseUrl = baseUrl
        if ":" in baseUrl:
            self.hostaddress = str(self.baseUrl[:self.baseUrl.rfind(":")].replace("http://", ""))
        
        self.name = 'Geoserver Module'

        self.user = userDict["geoServerUser"]
        self.pswd = userDict["geoServerPassword"]
        self.dataDirectory = userDict["dataDirectory"]
        self.serverUser = userDict["serverUser"]
        self.theKey = paramiko.RSAKey.from_private_key_file(userDict["serverPass"]) 
        
        
        
#        if base_url == 'geoserver.terrapop.org':
#            self.dataDirectory = '/web/tomcat6/webapps/geoserver/data/'
#            self.hostaddress = self.baseUrl
#            import haynes
#            self.user, self.pswd = haynes.getaccess()
#            self.serverPSWD = self.pswd
#        elif base_url == 'geoserver3.pop.umn.edu:8080':
#            self.hostaddress = self.baseUrl.split(':')[0]
#            self.dataDirectory = '/web/webapps/geoserver/data/data'
#            self.user = 'dahaynes'
#            self.pswd = 'xSQAb.ksU'
#            #geoserver doesn't support LDAP until geoserver 2.10            
#            import haynes
#            self.user, newPSWD = haynes.getaccess()
#            self.serverPSWD = newPSWD
#        elif base_url == 'localhost:8080':
#            self.hostaddress = self.baseUrl.split(':')[0]
#            self.dataDirectory = '/web/webapps/geoserver/data/data'
#            self.user = "admin"
#            self.pswd = "geoserver"
#            import haynes
#            self.user, newPSWD = haynes.getAccess()
#            self.serverPSWD = newPSWD
#        else:
#            self.dataDirectory = ''
#            print('No Data Directory found')

    def CreateTerraScopeWorkSpace(self, workspace_name):
        """ Creates a new Workspace on Geoserver.

        :param workspace_name:
        :return:
        """


        workDict = OrderedDict()
        workDict["workspace"] = OrderedDict()
        workDict["workspace"]["name"] = workspace_name
        workDict["workspace"]["dataStores"] = "http://%s/geoserver/rest/workspaces/%s/datastores.json" % (self.hostaddress, workspace_name)
        workDict["workspace"]["coverageStores"] = "http://%s/geoserver/rest/workspaces/%s/coveragestores.json" % (self.hostaddress, workspace_name)
        workDict["workspace"]["wmsStores"] = "http://%s/geoserver/rest/workspaces/%s/wmsStores.json" % (self.hostaddress, workspace_name)

        theJSON = json.dumps(workDict)

        return theJSON

    def DoesUrlExist(self,url):
        """ Determine if the url exists.

        :param url:
        :return:
        """
        print(url)
        r = self.get(url, auth=(self.user, self.pswd))
        return r.status_code

    def RemoveWorkSpace(self, workspace_name):
        """ The function removes a workspace and all associated layers.

        :param workspace_name:
        :return:
        """

        url = 'http://%s/geoserver/rest/workspaces/%s.json' % (self.baseUrl, workspace_name)
        resp = self.delete(url, auth=(self.user,self.pswd), params='recurse=True')
        return resp

    def EnableWorkspaceWMS(self, theWorkSpace):
        """

        :param theWorkSpace:
        :return:
        """

       

        wms = OrderedDict()
        wms["wms"] = OrderedDict()
        wms["wms"]["workspace"] = OrderedDict()
        wms["wms"]["workspace"]["name"] = theWorkSpace
        wms["wms"]["enabled"] = True
        wms["wms"]["name"]= "WMS"
        wms["wms"]["title"] = "GeoServer Web Map Service"
        wms["wms"]["maintainer"] = "http://terrapop.org"
        wms["wms"]["abstrct"] = "A compliant implementation of WMS plus most of the SLD extension (dynamic styling). Can also generate PDF, SVG, KML, GeoRSS",
        wms["wms"]["accessConstraints"]= "NONE"
        wms["wms"]["fees"] = "NONE"
        wms["wms"]["versions"] = OrderedDict()
        wms["wms"]["versions"]["org.geotools.util.Version"] = [ {"version":"1.1.1"}, {"version":"1.3.0" } ]
        wms["wms"]["keywords"] = OrderedDict()
        wms["wms"]["keywords"]["string"] =["WFS", "WMS", "GEOSERVER"]
        wms["wms"]["metadataLink"] = ""
        wms["wms"]["citeCompliant"] = False
        wms["wms"]["onlineResource"] = "http://geoserver.sourceforge.net/html/index.php"
        wms["wms"]["schemaBaseURL"] = "http://schemas.opengis.net"
        wms["wms"]["verbose"] = False
        wms["wms"]["metadata"] = OrderedDict()
        wms["wms"]["metadata"]["entry"] = [ {"@key":"svgRenderer", "$":"Batik" }, { "@key":"svgAntiAlias", "$":"true" } ]
        wms["wms"]["bboxForEachCRS"] = False
        wms["wms"]["watermark"] = OrderedDict()
        wms["wms"]["watermark"]["enabled"] = False
        wms["wms"]["watermark"]["position"] = "BOT_RIGHT"
        wms["wms"]["watermark"]["transparency"] = 0
        wms["wms"]["interpolation"]= "Nearest"
        wms["wms"]["getFeatureInfoMimeTypeCheckingEnabled"] = False
        wms["wms"]["getMapMimeTypeCheckingEnabled"] = False
        wms["wms"]["maxBuffer"] = 25
        wms["wms"]["maxRequestMemory"] = 65536
        wms["wms"]["maxRenderingTime"] = 60
        wms["wms"]["maxRenderingErrors"] =1000

        theJSON = json.dumps(wms)

        return  theJSON

        # {"wms":{"workspace":{"name":"sgl_demo"},"enabled":true,"name":"WMS","title":"GeoServer Web Map Service","maintainer":"http:\/\/geoserver.org\/comm","abstrct":"A compliant implementation of WMS plus most of the SLD extension (dynamic styling). Can also generate PDF, SVG, KML, GeoRSS","accessConstraints":"NONE","fees":"NONE","versions":{"org.geotools.util.Version":[{"version":"1.1.1"},{"version":"1.3.0"}]},"keywords":{"string":["WFS","WMS","GEOSERVER"]},"metadataLink":"","citeCompliant":false,"onlineResource":"http:\/\/geoserver.sourceforge.net\/html\/index.php","schemaBaseURL":"http:\/\/schemas.opengis.net","verbose":false,"metadata":{"entry":[{"@key":"svgRenderer","$":"Batik"},{"@key":"svgAntiAlias","$":"true"}]},"bboxForEachCRS":false,"watermark":{"enabled":false,"position":"BOT_RIGHT","transparency":0},"interpolation":"Nearest","getFeatureInfoMimeTypeCheckingEnabled":false,"getMapMimeTypeCheckingEnabled":false,"maxBuffer":25,"maxRequestMemory":65536,"maxRenderingTime":60,"maxRenderingErrors":1000}}

    def CreateDataStoreSGL(self, theHost, thePort, theDB, theEnvironment, theName):
        """

        :param theHost:
        :param thePort:
        :param theDB:
        :param theEnvironment:
        :param theName:
        :return:
        """


        store_name = "sgl_%s" % (theEnvironment)
        #print("Creating DataStore %s" % (store_name))
        dataStore = OrderedDict()
        dataStore["dataStore"] = OrderedDict()

        dataStore["dataStore"]["name"] = "current_%s_database" % (theEnvironment)
        dataStore["dataStore"]["type"] = "PostGIS"
        dataStore["dataStore"]["enabled"] = True
        dataStore["dataStore"]["description"] = "This %s store points the correct database for each application environment" % (store_name)


        dataStore["dataStore"]["workspace"] = OrderedDict()
        dataStore["dataStore"]["workspace"]["name"] = store_name
        #"http://geoserver3.pop.umn.edu:8080/geoserver/rest/workspaces/sgl_%s.json"
        dataStore["dataStore"]["workspace"]["href"] = "http://%s/geoserver/rest/workspaces/%s.json" % (self.hostaddress, store_name)

        dataStore["dataStore"]["connectionParameters"] = OrderedDict()

        dataStore["dataStore"]["connectionParameters"]["entry"] = [ OrderedDict( { "@key":"Connection timeout", "$":"20" } ), \
        OrderedDict( { "@key":"port", "$":thePort } ), \
        OrderedDict( { "@key":"passwd", "$":"plain:keswedrurU4a" } ), \
        OrderedDict( { "@key":"dbtype", "$":"postgis" } ), \
        OrderedDict( { "@key":"encode functions", "$":"false" } ), \
        OrderedDict( { "@key":"Evictor run periodicity", "$":"300" } ), \
        OrderedDict( { "@key":"namespace", "$":store_name } ), \
        OrderedDict( { "@key":"schema", "$":"public" } ), \
        OrderedDict( { "@key":"create database", "$":"false" } ), \
        OrderedDict( { "@key":"fetch size", "$":"1000" } ), \
        OrderedDict( { "@key":"preparedStatements", "$":"false" } ), \
        OrderedDict( { "@key":"min connections", "$":"1" } ), \
        OrderedDict( {"@key":"Evictor tests per run", "$":"3" } ), \
        OrderedDict( {"@key":"host", "$":theHost} ), \
        OrderedDict( {"@key":"validate connections", "$":"true" } ), \
        OrderedDict( { "@key":"max connections", "$":"10" } ), \
        OrderedDict( { "@key":"database", "$":theDB } ), \
        OrderedDict( { "@key":"Support on the fly geometry simplification", "$":"true" } ),  \
        OrderedDict( { "@key":"Max connection idle time", "$":"300"  } ), \
        OrderedDict( { "@key":"Test while idle", "$":"true" } ), \
        OrderedDict( { "@key":"Loose bbox", "$":"true" } ), \
        OrderedDict( { "@key":"Expose primary keys", "$":"false" } ), \
        OrderedDict( { "@key":"Max open prepared statements", "$":"50" } ), \
        OrderedDict( { "@key":"Estimated extends", "$":"true" } ),  \
        OrderedDict( { "@key":"user", "$":"terrascope" } ) ]

        dataStore["dataStore"]["_default"] = False
        #"http://geoserver3.pop.umn.edu:8080/geoserver/rest/workspaces/sgl_demo/datastores/current_demo_database/featuretypes.json"
        dataStore["dataStore"]["featureTypes"] = "http://%s/geoserver/rest/workspaces/%s/datastores/current_%s_database/featuretypes.json" % (self.hostaddress, store_name, theEnvironment)

        theJSON = json.dumps(dataStore)

        assert isinstance(theJSON, object)
        return  theJSON

    def PostToGeoserver(self,geoserver_url, geoserver_xml):
        """ This posts xml to the geoserver directory.

        :param geoserver_url:
        :param geoserver_xml:
        :return:
        """

        headers = {'Content-type':'text/xml'}
        resp = self.post(geoserver_url, auth=(self.user,self.pswd), data=geoserver_xml, headers=headers)
        return resp

    def PostJSONToGeoserver(self,geoserver_url, geoserver_json):
        """ This posts xml to the geoserver directory.

        :param geoserver_url:
        :param geoserver_json:
        :return:
        """

        headers = {'Content-type':'text/json'}
        resp = self.post(geoserver_url, auth=(self.user,self.pswd), data=geoserver_json, headers=headers)
        return resp

    def PutJSONGeoserver(self,geoserver_url, geoserver_json):
        """ This posts xml to the geoserver directory.

        :param geoserver_url:
        :param geoserver_json:
        :return:
        """

        headers = {'Content-type':'text/json'}
        resp = self.put(geoserver_url, auth=(self.user,self.pswd), data=geoserver_json, headers=headers)
        return resp
    
    def ServerDirectory(self,schema):
        """ Use the Paramiko library to check if a directory exists on the server, if there is none one is created.

        :return:
        """

        import paramiko
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(self.hostaddress, username=self.serverUser, pkey=self.theKey)
        sftp = ssh.open_sftp() 
        #sftp = paramiko.SFTPClient.from_transport
        print(self.hostaddress, self.serverUser)
        #transport = paramiko.Transport((self.hostaddress, 22)) 
        #ssh.connect("129.114.104.42", username="dhaynes", pkey=theKey)
        
        #transport.connect(username=self.serverUser, pkey=self.theKey)
        #transport.connect(username=self.user, password=self.serverPSWD)

        
        sftp.chdir(self.dataDirectory)
        connect_xml = r'%s/connect.postgis.xml' % (self.dataDirectory)
        print(connect_xml)
        try:
            if not sftp.stat(connect_xml):
                pass    
        except:
            print("No Connect file")
            
            self.CopyConnectXML(r"E:\git\SOLAP\connect.postgis.xml", connect_xml )
            
        try:
            directory_path = r'%s/%s' % (self.dataDirectory, schema)
            sftp.chdir(directory_path)
            sftp.close()
            return 1
        except IOError:
            print('Directory %s/%s not found, creating new directory' % (self.dataDirectory, schema))
            sftp.mkdir(schema) 
            connect_xml = r'%s/connect.postgis.xml' % (self.dataDirectory)
            
            #ssh = paramiko.SSHClient() 
            #ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            #print self.baseUrl, self.hostaddress
            ssh.connect(self.hostaddress, 22, username=self.serverUser, pkey=self.theKey)
            
            #This has been removed as we no longer want to copy the connect.postgis.xml file around anymore
#            new_xml = r'%s/%s/%s'  % (self.dataDirectory, schema,'connect.postgis.xml')
#            copy_command = 'cp %s %s' % (connect_xml, new_xml)
#            ssh.exec_command(copy_command)

            return 1

    def CopyConnectXML(self,localFilePath, remoteFilePath):
        """
        connect.postgis.xml
        <connect>
           <dstype value="DBCP"/>
           <username value="david"/>
           <password value="pss"/>
           <jdbcUrl value="jdbc:postgresql://129.114.104.42:5432/spatial_analytics"/>
           <driverClassName value="org.postgresql.Driver"/>
           <maxActive value="10"/>
           <maxIdle value="0"/>
        </connect>
        """
#         ssh = paramiko.SSHClient() 
#         ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
#            #print self.baseUrl, self.hostaddress
#        ssh.connect(self.hostaddress, 22, username=self.serverUser, pkey=self.theKey)
#        copy_command = 'cp %s %s' % (connect_xml, new_xml)
#        ssh.exec_command(copy_command)
        
        
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(self.hostaddress, username=self.serverUser, pkey=self.theKey)
        ftp_client=ssh.open_sftp()
        ftp_client.put(localFilePath,remoteFilePath)
        ftp_client.close()
        print("added file")

    def RemoveServerDirectory(self, schema):
        """ Use paramiko library to connect to server and remove directory.

        :param schema:
        :return:
        """

        import paramiko
        sftp = paramiko.sftp_client
        sftp = paramiko.SFTPClient.from_transport
        
        transport = paramiko.Transport((self.hostaddress, 22))
        transport.connect(username=self.serverUser, pkey=self.theKey)
        sftp = paramiko.SFTPClient.from_transport(transport)
        sftp.chdir(self.dataDirectory)
        if schema in sftp.listdir():
            sftp.chdir(schema)
            theFiles = sftp.listdir()            

            for f in theFiles:
                sftp.remove(f)
            
        try:
            sftp.chdir(self.dataDirectory)
            sftp.rmdir(schema)
        except IOError:
            print("Directory: %s does not exist" % (schema))

    def WriteXMLtoGeoserver(self,schema, xml_string, xml_name):
        """ Writes XML to Geoserver using path /web/tomcat6/webapps/geoserver/data/<>/<>.xml. input: schema,
        xmlasstring, xmlname

        :param schema:
        :param xml_string:
        :param xml_name:
        :return:
        """

        import paramiko        
        
        ssh = paramiko.SSHClient() 
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(self.hostaddress, username=self.serverUser, pkey=self.theKey)
        ftp = ssh.open_sftp()
        geoserver_xml = '%s/%s/%s.xml' % (self.dataDirectory, schema, xml_name)
        print("Writing {}".format(geoserver_xml))
        xmlfile = ftp.file(geoserver_xml, 'w')
        xmlfile.write(xml_string)
        #xmlfile.flush()
        xmlfile.close()
        ftp.close()
        ssh.close()

    def CreateWorkspaceXML(self, workspace_name):
        """ Creates a new Workspace on Geoserver.

        :param workspace_name:
        :return:
        """

        root = self.etree.Element("workspace")
        name_el = self.etree.SubElement(root, "name")
        name_el.text = workspace_name
        
        data_store_el = self.etree.SubElement(root, "dataStores")
        url1 = "http://%s/geoserver/rest/workspaces/%s/datastores.xml"  % (self.hostaddress, workspace_name)
        data_link = self.etree.SubElement(data_store_el, "atom", href=url1,  type="application/xml")
        
        coverage_store_el = self.etree.SubElement(root, "coverageStores")
        url2 = "http://%s/geoserver/rest/workspaces/%s/coveragestores.xml"  % (self.hostaddress, workspace_name)
        coverage_link = self.etree.SubElement(coverage_store_el, "atom", href=url2,  type="application/xml" )
        
        wms_store_el = self.etree.SubElement(root, "wmsStores")
        url2 = "http://%s/geoserver/rest/workspaces/%s/wmsstores.xml"  % (self.hostaddress, workspace_name)
        wms_link = self.etree.SubElement(wms_store_el, "atom", href=url2,  type="application/xml" )
        
        outputxml = self.etree.tostring(root,  encoding='unicode').replace("atom", "atom:link")
        return outputxml

    def CreateMappingXML(self, mosaic):
        """ This function uses the xml tree to create the pg_raster mapping xml.

        :param mosaic:
         :return:
        """

        #  from lxml import etree
        root = self.etree.Element("root")
        spatial_element = self.etree.SubElement(root, "spatialExtension")
        spatial_element.set("name", "pgraster")
        mapping_element = self.etree.SubElement(root, "mapping")
        mastertable_element = self.etree.SubElement(mapping_element, "masterTable")
        mastertable_element.set("name", mosaic)
        coverage_element = self.etree.SubElement(mastertable_element, "coverageNameAttribute", name="NAME")

        maxx_element = self.etree.SubElement(mastertable_element, "maxXAttribute", name="maxX")
        maxy_element = self.etree.SubElement(mastertable_element, "maxYAttribute", name="maxY")
        minx_element = self.etree.SubElement(mastertable_element, "minXAttribute", name="minX")
        miny_element = self.etree.SubElement(mastertable_element, "minYAttribute", name="minY")
        resx_element = self.etree.SubElement(mastertable_element, "resXAttribute", name="resX")
        resy_element = self.etree.SubElement(mastertable_element, "resYAttribute", name="resY")
        
        tile_element = self.etree.SubElement(mastertable_element, "tileTableNameAtribute", name="TileTable")
        tiletable_element = self.etree.SubElement(mapping_element, "tileTable")
        blob_element = self.etree.SubElement(tiletable_element, "blobAttributeName", name="rast")
        
        #  We don't return root, because the mapping xml has two main trunks, spatial and mappping.
        outputxml = self.etree.tostring(spatial_element, encoding='unicode') + self.etree.tostring(mapping_element, encoding='unicode')
        
        return outputxml

    def CreateMosaicXML(self, mosaic, epsg):
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
        
        root = self.etree.Element("config", version="1.0")
        
        if 'mosaic' in mosaic:
            coverage_element2 = self.etree.SubElement(root, "coverageName", name='%s'%(mosaic))
        else:
            coveragename = '%s_mosaic' % (mosaic)
            coverage_element2 = self.etree.SubElement(root, "coverageName", name='%s'%(coveragename))
        
        cooord_element = self.etree.SubElement(root, "coordsys", name='EPSG:%s'%(epsg))
        scale_element = self.etree.SubElement(root, "scaleop", interpolation='1')
        verify_element = self.etree.SubElement(root, "verify", cardinality='false')
        multiline_string = '''hd\n&mapping;\n&connect;'''
        verify_element.tail = multiline_string

        #  Another wierd thing about the geosever xml that we need to clean up before it can be used
        outputxml = self.etree.tostring(root, doctype=docstring, encoding='unicode').replace('amp;','') #.decode("utf-8")

        return outputxml

    def CreateStoreXML(self, store_name, store_description, store_workspace, geo_path):
        """
        This function creates the raster coverage store

        :param store_name:
        :param store_description:
        :param store_workspace:
        :param geo_path:
        :return:
        """
        
        root = self.etree.Element("coverageStore")
        name_element = self.etree.SubElement(root, "name").text = store_name
        description_element = self.etree.SubElement(root, "description").text = store_description
        type_element = self.etree.SubElement(root, "type").text = 'ImageMosaicJDBC'
        enabled_element = self.etree.SubElement(root, "enabled").text = 'true'
        workspace_element = self.etree.SubElement(root, "workspace")
        name_element = self.etree.SubElement(workspace_element, "name")
        
        name_element.text = str(store_workspace)
        url ="http://%s/geoserver/rest/workspaces/%s.xml"  % (self.hostaddress, store_workspace)
        link_element = self.etree.SubElement(workspace_element, "atom", href=url, type="application/xml")
        default_element = self.etree.SubElement(root, "_default")
        default_element.text ='false'
        url_element = self.etree.SubElement(root, "url")
        url_element.text = geo_path
        coverages_element = self.etree.SubElement(root, "coverages")
        url2 = "http://%s/geoserver/rest/workspaces/%s/coveragestores/%s/coverages.xml"  % (self.hostaddress, store_workspace, store_name)
        coverage_element = self.etree.SubElement(coverages_element, "atom", href=url2,  type="application/xml" )
                
        outputxml = self.etree.tostring(root, encoding='unicode').replace("atom", "atom:link")
        return outputxml

    def CreateCoverageXML(self, variable_mnemonic, workspace, mosaic_table, schema_mosaic, epsg, stats, metadata, extent):
        """ This will create the coverage xml, which defines the raster dataset.

        :param variable_mnemonic:
        :param workspace:
        :param mosaic_table:
        :param schema_mosaic:
        :param epsg:
        :param stats:
        :param metadata:
        :param extent:
        :return:
        """

        'Unpack all of the composite variables'    
        Minimum, Maximum, Mean, StDev, NoData = stats
        srs_text, cols, rows, scalex, scaley = metadata
        minx, maxy, maxx, miny = extent
        
        root = self.etree.Element("coverage")
        name_el = self.etree.SubElement(root, "name").text = variable_mnemonic
        nativename_el = self.etree.SubElement(root, "nativeName").text = variable_mnemonic
        namespace_el = self.etree.SubElement(root, "namespace")
        namespace_name_el = self.etree.SubElement(namespace_el, "name").text = workspace
        url = "http://%s/geoserver/rest/namespaces/%s.xml" % (self.hostaddress, workspace)
        namespace_atom_el = self.etree.SubElement(namespace_el, "atom", rel="alternate", href=url, type="application/xml")
        name_el = self.etree.SubElement(root, "title").text = mosaic_table
        #could be mosaic_table -- example (gli.barley_harvestedarea_mosaic)
        #needs to be replaced with a small text description
        description_el = self.etree.SubElement(root, "description").text = "Generated from ImageMosaicJDBC"
        abstract_el = self.etree.SubElement(root, "abstract").text = "data to be filled in"
        keywords_el = self.etree.SubElement(root, "keywords")
        keywords_string1_el = self.etree.SubElement(keywords_el, "string").text = 'WCS'
        keywords_string2_el = self.etree.SubElement(keywords_el, "string").text = 'ImageMosaicJDBC'
        keywords_string3_el = self.etree.SubElement(keywords_el, "string").text = mosaic_table
        nativeCRS_el = self.etree.SubElement(root, "nativeCRS").text = srs_text
        projection = 'EPSG:%s' % (epsg)
        srs_el = self.etree.SubElement(root, "srs").text = projection
        nativeBB_el  = self.etree.SubElement(root, "nativeBoundingBox")
        nativeBB__minx_el = self.etree.SubElement(nativeBB_el, "minx").text = str(minx)
        nativeBB__maxx_el = self.etree.SubElement(nativeBB_el, "maxx").text = str(maxx)
        nativeBB__miny_el = self.etree.SubElement(nativeBB_el, "miny").text = str(miny)
        nativeBB__maxy_el = self.etree.SubElement(nativeBB_el, "maxy").text = str(maxy)
        
        LatLongBB_el  = self.etree.SubElement(root, "latLonBoundingBox")   
        LatLongBB__minx_el = self.etree.SubElement(LatLongBB_el, "minx").text = str(minx)
        LatLongBB__maxx_el = self.etree.SubElement(LatLongBB_el, "maxx").text = str(maxx)
        LatLongBB__miny_el = self.etree.SubElement(LatLongBB_el, "miny").text = str(miny)
        LatLongBB__maxy_el = self.etree.SubElement(LatLongBB_el, "maxy").text = str(maxy)
        
        projectionPolicy_el  = self.etree.SubElement(root, "projectionPolicy").text = 'REPROJECT_TO_DECLARED'
        enabled_el  = self.etree.SubElement(root, "enabled").text = 'true'
        metadata_el  = self.etree.SubElement(root, "metadata")
        metadata_entry1_el  = self.etree.SubElement(metadata_el, "entry")   
        metadata_entry1_el.set("key","cachingEnabled")        

        #metadata_entry1_el.set("key","dirName")
        #metadata_entry1_el.text = ('%s_%s'  % (variable_mnemonic,mosaic_table))
        #metadata_entry2_el = self.etree.SubElement(metadata_el, "entry")
        #metadata_entry2_el.text = 'false'
        
        store_el  = self.etree.SubElement(root, "store")
        store_el.set("class","coverageStore")
        store_name_el  = self.etree.SubElement(store_el, "name").text = variable_mnemonic
        url2 = "http://%s/geoserver/rest/workspaces/%s/coveragestores/%s.xml" % (self.hostaddress, workspace, variable_mnemonic)
        #store_atom_el = self.etree.SubElement(store_el, "atom", rel="alternate", href=url2, type="application/xml")
        store_atom_el = self.etree.SubElement(store_el, "atom", rel="alternate", href=url2)
        store_atom_el.set("type","application/xml")
        nativeFormat_el  = self.etree.SubElement(root, "nativeFormat").text = 'ImageMosaicJDBC'
        
        grid_el  = self.etree.SubElement(root, "grid", dimension="2")
        grid_range_el  = self.etree.SubElement(grid_el, "range")
        grid_range_low_el  = self.etree.SubElement(grid_range_el, "low").text = "0 0"
        grid_range_high_el  = self.etree.SubElement(grid_range_el, "high").text = ("%s %s" % (cols, rows))   
        transform_el  = self.etree.SubElement(grid_el, "transform")
        transform_scaleX_el  = self.etree.SubElement(transform_el, "scaleX").text = str(scalex)
        transform_scaleY_el  = self.etree.SubElement(transform_el, "scaleY").text = str(scaley)
        transform_shearX_el  = self.etree.SubElement(transform_el, "shearX").text = '0'
        transform_shearY_el  = self.etree.SubElement(transform_el, "shearY").text = '0'
        #possibly top left hand corner
        transform_translateX_el  = self.etree.SubElement(transform_el, "translateX").text = '-179.91666157981484'
        transform_translateY_el  = self.etree.SubElement(transform_el, "translateY").text = '89.91666920862026'    
        crs_el = self.etree.SubElement(grid_el, "crs").text = projection
        
        supportedFormats_el  = self.etree.SubElement(root, "supportedFormats")
        supportedFormats_GIF_el  = self.etree.SubElement(supportedFormats_el, "string").text = 'GIF'
        supportedFormats_PNG_el  = self.etree.SubElement(supportedFormats_el, "string").text = 'PNG'
        supportedFormats_JPEG_el  = self.etree.SubElement(supportedFormats_el, "string").text = 'JPEG'
        supportedFormats_TIFF_el  = self.etree.SubElement(supportedFormats_el, "string").text = 'TIFF'
        supportedFormats_GEOTIFF_el  = self.etree.SubElement(supportedFormats_el, "string").text = 'GEOTIFF'
        
        interpolationMethods_el  = self.etree.SubElement(root, "interpolationMethods")
        interpolationMethods_1_el  = self.etree.SubElement(interpolationMethods_el, "string").text = 'nearest neighbor'
        interpolationMethods_2_el  = self.etree.SubElement(interpolationMethods_el, "string").text = 'bilinear'
        interpolationMethods_3_el  = self.etree.SubElement(interpolationMethods_el, "string").text = 'bicubic'
        defaultInterpolationMethod_el  = self.etree.SubElement(root, "defaultInterpolationMethod").text = 'nearest neighbor'
        
        dimensions_el  = self.etree.SubElement(root, "dimensions")
        coverageDimension_el  = self.etree.SubElement(dimensions_el, "coverageDimension")
        coverageDimension_name_el  = self.etree.SubElement(coverageDimension_el, "name").text = mosaic_table
        coverageDimension_description_el  = self.etree.SubElement(coverageDimension_el, "description").text = 'GridSampleDimension[0.0,1.0]'
        coverageDimension_range_el  = self.etree.SubElement(coverageDimension_el, "range")
        coverageDimension_range_min_el  = self.etree.SubElement(coverageDimension_range_el, "min").text = str(Minimum)
        coverageDimension_range_max_el  = self.etree.SubElement(coverageDimension_range_el, "max").text = str(Maximum)
        coverageDimension_description_nullValues_el  = self.etree.SubElement(coverageDimension_el, "nullValues")
        coverageDimension_description_nullValues_double_el  = self.etree.SubElement(coverageDimension_description_nullValues_el, "double").text = str(NoData)
        coverageDimension_dimensionType_el  = self.etree.SubElement(coverageDimension_el, "dimensionType")
        coverageDimension_dimensionType_name_el  = self.etree.SubElement(coverageDimension_dimensionType_el, "name").text = 'REAL_32BITS'
        
        requestSRS_el  = self.etree.SubElement(root, "requestSRS")
        requestSRS_string_el = self.etree.SubElement(requestSRS_el, "string").text = projection
        responseSRS_el  = self.etree.SubElement(root, "responseSRS")
        responseSRS_string_el = self.etree.SubElement(responseSRS_el, "string").text = projection
        
        parameters_el  = self.etree.SubElement(root, "parameters")
        parameters_entry1_el  = self.etree.SubElement(parameters_el, "entry")
        parameters_entry1_string1_el  = self.etree.SubElement(parameters_entry1_el, "string").text = 'BackgroundColor'
        parameters_entry1_string2_el  = self.etree.SubElement(parameters_entry1_el, "string").text = ''
        
        parameters_entry2_el  = self.etree.SubElement(parameters_el, "entry")
        parameters_entry2_string1_el  = self.etree.SubElement(parameters_entry2_el, "string").text = 'OutputTransparentColor'
        parameters_entry2_string2_el  = self.etree.SubElement(parameters_entry2_el, "string").text = ''
        
        nativeCoverageName_el  = self.etree.SubElement(root, "nativeCoverageName").text = schema_mosaic
        
        outputxml = self.etree.tostring(root, encoding='unicode').replace("atom", "atom:link")
        return outputxml

    #  Unused Functions

    def PutToGeoserver(self,geoserver_url, geoserver_xml):
        headers = {'Content-type':'text/xml'}
        resp = self.put(geoserver_url, auth=(self.user,self.pswd), data=geoserver_xml, headers=headers)
        return resp

    def GetFromGeoserver(self,geoserver_url):
        headers = {'Content-type':'text/xml'}
        resp = self.get(geoserver_url, auth=(self.user,self.pswd), headers=headers)
        return resp

    def GetJSONFOMGeoserver(self,geoserver_url, ):
        """This posts xml to the geoserver directory """
        headers = {'Content-type':'text/json'}
        resp = self.get(geoserver_url, auth=(self.user,self.pswd), headers=headers)
        return resp

    def CreateRasterLayerXML(self, variable_mnemonic, store_workspace, style_name):
        """This creates the raster layer in geoserver, which is the visualization """
        root = self.etree.Element("layer")
        name_el = self.etree.SubElement(root, "name").text = variable_mnemonic
        type_el = self.etree.SubElement(root, "type").text = "RASTER"
        default_el = self.etree.SubElement(root, "defaultStyle")
        default_name_el = self.etree.SubElement(default_el, "defaultStyle")
        default_name_el.text = style_name
        default_workspace_el = self.etree.SubElement(default_el, "workspace").text = store_workspace
        url = "http://%s/geoserver/rest/workspaces/%s/styles/%s.xml" % (self.hostaddress, store_workspace, style_name)
        default_atom_el = self.etree.SubElement(default_el, "atom", rel="alternate", href=url, type="application/xml")
        resource_el = self.etree.SubElement(root, "resource")
        resource_el.set("class","coverage")
        resource_name_el = self.etree.SubElement(resource_el, "name").text = variable_mnemonic
        url2 = "http://%s/geoserver/rest/workspaces/%s/coveragestores/%s/coverages/%s.xml" % (self.hostaddress, store_workspace,variable_mnemonic,variable_mnemonic)
        resource_atom_el = self.etree.SubElement(resource_el, "atom", rel="alternate", href=url2, type="application/xml").text = variable_mnemonic
        attribution_el = self.etree.SubElement(root, "attribution")
        attribution_logoW_el = self.etree.SubElement(attribution_el, "logoWidth").text = "0"
        attribution_logoH_el = self.etree.SubElement(attribution_el, "logoHeight").text = "0"

        outputxml = self.etree.tostring(root, encoding='unicode').replace("atom", "atom:link")
        return outputxml

    def EnableWFS(self):
        pass
        # {"wfs":{"workspace":{"name":"sgl_demo"},"enabled":true,"name":"WFS","title":"GeoServer Web Feature Service","maintainer":"http:\/\/geoserver.org\/comm","abstrct":"This is the reference implementation of WFS 1.0.0 and WFS 1.1.0, supports all WFS operations including Transaction.","accessConstraints":"NONE","fees":"NONE","versions":{"org.geotools.util.Version":[{"version":"1.0.0"},{"version":"1.1.0"},{"version":"2.0.0"}]},"keywords":{"string":["WFS","WMS","GEOSERVER"]},"metadataLink":"","citeCompliant":false,"onlineResource":"http:\/\/geoserver.sourceforge.net\/html\/index.php","schemaBaseURL":"http:\/\/schemas.opengis.net","verbose":false,"gml":{"entry":[{"version":"V_10","gml":{"srsNameStyle":["XML"],"overrideGMLAttributes":true}},{"version":"V_20","gml":{"srsNameStyle":["URN2"],"overrideGMLAttributes":false}},{"version":"V_11","gml":{"srsNameStyle":["URN"],"overrideGMLAttributes":false}}]},"serviceLevel":"COMPLETE","maxFeatures":1000000,"featureBounding":false,"canonicalSchemaLocation":false,"encodeFeatureMember":false,"hitsIgnoreMaxFeatures":false}}


#    def CreateStyle(self, variable_mnemonic, store_workspace):
#        """This adds a style to the given layer """
#
#        root = self.etree.Element("styles")
#        style_el1 = self.etree.SubElement(root, "style")
#        name_el1 = self.etree.SubElement(style_el1, "name").text = "tp_raster_generic"
#        url1 = "http://%s/geoserver/rest/layers/applehar/styles/tp_raster_ramp.xml" % (self.hostaddress)
#        default_atom_el1 = self.etree.SubElement(style_el1, "atom", rel="alternate", href=url1, type="application/xml")
#
#        #style_el2 = self.etree.SubElement(root, "style")
#        #name_el2 = self.etree.SubElement(style_el, "name").text = style_name
#        #url2 = "http://geoserver.terrapop.org/geoserver/rest/layers/%s/styles/%s.xml" % (variable_mnemonic, style_name)
#        #default_atom_el2 = self.etree.SubElement(style_el, "atom", rel="alternate", href=url, type="application/xml")
#
#        outputxml = self.etree.tostring(root).replace("atom", "atom:link")
#        return outputxml


