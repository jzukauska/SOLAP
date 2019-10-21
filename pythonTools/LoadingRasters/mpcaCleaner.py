# -*- coding: utf-8 -*-
"""
Created on Tue Oct 15 12:43:17 2019

@author: dahaynes
"""

import csv



inCSVPath = r"e:\git\solap\datasets\mpca_agency_interests.csv"
outCSVPath = r"e:\git\solap\datasets\mpca_agency_interests_cleaned.csv"

with open(inCSVPath, 'r', ) as fin, open(outCSVPath, 'w', newline="\n") as fout:
    inCSV = csv.reader(fin)
    outCSV = csv.writer(fout, delimiter= ",")
    for l, line in enumerate(inCSV):
        
        if line: 
            outCSV.writerow(line)
            
        
print("Done")        
        