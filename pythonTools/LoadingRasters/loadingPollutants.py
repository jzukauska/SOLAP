# -*- coding: utf-8 -*-
"""
Created on Sun Nov  3 21:58:14 2019

Loading the caces downscaled modeled pollutant
@author: david
"""


import pandas, glob, os
from sqlalchemy import create_engine



dataDirectory = r"C:\work"
dataset = glob.glob(os.path.join(dataDirectory,"uwc15728381770719ae671dd7d18d0161c2d8acba600306e.csv") )
engine = create_engine('postgresql://david:haynes@localhost:5432/research')

listOfVariables = ['no2', 'o3', 'pm10', 'pm25', 'so2', 'co']

df = pandas.read_csv(dataset)
for v in listOfVariables:
    theData = df[df.pollutant.isin(listOfVariables)].drop(columns=['lat','lon'])
    theData.to_sql('caces_{}'.format(v), engine)

    break