# -*- coding: utf-8 -*-
"""
Created on Mon Oct 28 16:00:23 2019
Loading 500 Cities data
@author: dahaynes
"""


import pandas, glob, os
from sqlalchemy import create_engine

listOfVariables = ["Current lack of health insurance among adults aged 18-64 Years",\
                   "Binge drinking among adults aged >=18 Years",\
                   "Current smoking among adults aged >=18 Years",\
                   "No leisure-time physical activity among adults aged >=18 Years",\
                   "Visits to doctor for routine checkup within the past Year among adults aged >=18 Years",\
                   "Physical health not good for >=14 days among adults aged >=18 Years",\
                   "Mental health not good for >=14 days among adults aged >=18 Years",\
                   "Obesity among adults aged >=18 Years"]
geographicVariables = ["City", "Census Tract"]

dataDirectory = r"E:\data\500_cities_datasets"
outDirectory = r"E:\git\SOLAP\datasets"
datasets = glob.glob(os.path.join(dataDirectory,"*.csv") )
#engine = create_engine('postgresql://david:secret@localhost:5432/spatial_analytics')

year = 2016
for d in datasets:
    df = pandas.read_csv(d)
    
    theData = df[df.Measure.isin(listOfVariables) & df.GeographicLevel.isin(geographicVariables)]
    theData.to_csv(os.path.join(outDirectory, "health_{}.csv".format(year)))
    #theData.to_sql('health_behaviours_{}'.format(year), engine)
    year += 1
    #break
    