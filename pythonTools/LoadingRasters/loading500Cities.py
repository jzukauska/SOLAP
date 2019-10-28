# -*- coding: utf-8 -*-
"""
Created on Mon Oct 28 16:00:23 2019
Loading 500 Cities data
@author: dahaynes
"""


import pandas, glob, os
from sqlalchemy import create_engine

listOfVariables = ["Current lack of health insurance among adults aged 18-64 Years"]
geographicVariables = ["City", "Census Tract"]

dataDirectory = r"E:\data\500_cities_datasets"
datasets = glob.glob(r"{}\*.csv".format(dataDirectory))
engine = create_engine('postgresql://david:haynes@localhost:5432/research')

year = 2016
for d in datasets:
    df = pandas.read_csv(d)
    
    theData = df[df.Measure.isin(listOfVariables) & df.GeographicLevel.isin(geographicVariables)]
    theData.to_sql('health_behaviours_{}'.format(year), engine)
    year += 1
    break