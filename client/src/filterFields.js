const commonFields = [
  {
    name: "MultiVarible Tab"
  },
  {
    name: "Time Period",
    type: "slider",
    placeholder: "Select Available Time Period",
    fieldOptions: []
  },
  {
    name: "Geographic Unit",
    type: "radio",
    value: "County",
    fieldOptions: [
      {
        label: "County",
        value: "County"
      },
      {
        label: "Census Tracts",
        value: "Census Tracts"
      }
    ]
  }
];

const scopedFilterFields = [
  {
    name: "demographic",
    options: [
      {
        name: "Population By Sex",
        options: [
          {
            name: "totalPopulation",
            type: "radio",
            dataType: "polygon",
            geoserver_layer: "demographics",
            functions: ["choropleth"],
            fieldOptions: [
              {
                label: "Total Population",
                value: "total",
                year: [2000, 2010]
              },
              {
                label: "Total Females",
                value: "female",
                year: [2000, 2010]
              },
              {
                label: "Total Males",
                value: "male",
                year: [2000, 2010]
              }
            ]
          }
        ]
      },
      {
        name: "Population By Race",
        options: [
          {
            name: "Race",
            type: "radio",
            geoserver_layer: "demographics",
            dataType: "polygon",
            functions: "choropleth",
            fieldOptions: [
              {
                label: "White",
                value: "white_alone",
                year: [2000, 2010]
              },
              {
                label: "Black",
                value: "black_alone",
                year: [2000, 2010]
              },
              {
                label: "American Indian",
                value: "american_indian_alone",
                year: [2000, 2010]
              },
              {
                label: "Asian",
                value: "asian_alone",
                year: [2000, 2010]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Neighborhood",
    options: [
      {
        name: "Points",
        options: [
          {
            name: "Points",
            type: "radio",
            dataType: "point",
            functions: ["point"],
            fieldOptions: [
              {
                label: "Alcohol Retailers",
                value: "Alcohol Retailers",
                year: [2019],
                geoserver_layer: "alcohol_outlet"
              },
              {
                label: "Tobacco Retailers",
                value: "Tobacco Retailers",
                year: [2019],
                geoserver_layer: "tobacco_outlet"
              },
              {
                label: "Religious Sites",
                value: "Religious Sites",
                year: [2019],
                geoserver_layer: "religious"
              },
              {
                label: "YMCA",
                value: "YMCA",
                year: [2019],
                geoserver_layer: "ymca"
              },
              {
                label: "Veterans Facilities (VFW)",
                value: "Veterans Facilities (VFW)",
                year: [2019],
                geoserver_layer: "vfw"
              },
              {
                label: "American Legions",
                value: "American Legions",
                year: [2019],
                geoserver_layer: "american_legion"
              },
              {
                label: "Libraries",
                value: "Libraries",
                geoserver_layer: "library",
                year: [2019]
              },
              {
                label: "Traffic Stops",
                value: "Traffic Stops",
                year: [2016, 2017, 2018, 2019],
                geoserver_layer: "traffic_stops"
              }
            ]
          }
        ]
      },
      {
        name: "HeatMap Visualization",
        options: [
          {
            name: "HeatMap",
            type: "radio",
            dataType: "point",
            functions: ["HeatMap"],
            fieldOptions: [
              {
                label: "Alcohol Retailers",
                value: "Alcohol Retailers",
                geoserver_layer: "alcohol_outlet",
                year: [2019]
              },
              {
                label: "Tobacco Retailers",
                value: "Tobacco Retailers",
                geoserver_layer: "tobacco_outlet",
                year: [2019]
              },
              {
                label: "Religious Sites",
                value: "Religious Sites",
                geoserver_layer: "religious",
                year: [2019]
              },
              {
                label: "YMCA",
                value: "YMCA",
                geoserver_layer: "ymca",
                year: [2019]
              },
              {
                label: "Veterans Facilities (VFW)",
                value: "Veterans Facilities (VFW)",
                geoserver_layer: "vfw",
                year: [2019]
              },
              {
                label: "American Legions",
                value: "American Legions",
                geoserver_layer: "american_legion",
                year: [2019]
              },
              {
                label: "Libraries",
                value: "Libraries",
                geoserver_layer: "library",
                year: [2019]
              },
              {
                label: "Traffic Stops",
                value: "Traffic Stops",
                year: [2016, 2017, 2018, 2019],
                geoserver_layer: "traffic_stops"
              }
            ]
          }
        ]
      },
      {
        name: "Spatial Analysis",
        options: [
          {
            name: "Count Features",
            type: "radio",
            dataType: "point",
            geoserver_layer: "neighborhood_count",
            parameterKey: "resource",
            functions: ["count"],
            fieldOptions: [
              {
                label: "Alcohol Retailers",
                value: "Alcohol Retailers",
                year: [2019],
                geoserver_layer: "alcohol_outlet",
                parameter: ["alcohol_outlet"]
              },
              {
                label: "Tobacco Retailers",
                value: "Tobacco Retailers",
                year: [2019],
                geoserver_layer: "tobacco_outlet",
                parameter: ["tobacco_outlet"]
              },
              {
                label: "Religious Sites",
                value: "Religious Sites",
                year: [2019],
                geoserver_layer: "religious",
                parameter: ["religious"]
              },
              {
                label: "YMCA",
                value: "YMCA",
                year: [2019],
                geoserver_layer: "ymca",
                parameter: ["ymca"]
              },
              {
                label: "Veterans Facilities (VFW)",
                value: "Veterans Facilities (VFW)",
                year: [2019],
                geoserver_layer: "vfw",
                parameter: ["vfw"]
              },
              {
                label: "American Legions",
                value: "American Legions",
                year: [2019],
                geoserver_layer: "american_legion",
                parameter: ["american_legion"]
              },
              {
                label: "Libraries",
                value: "Libraries",
                geoserver_layer: "library",
                year: [2019],
                parameter: ["library"]
              },
              {
                label: "Traffic Stops",
                value: "Traffic Stops",
                year: [2019],
                geoserver_layer: "traffic_stops",
                parameter: ["traffic_stops"]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "SocioEconomics",
    options: [
      {
        name: "SocioEconomics",
        type: "radio",
        dataType: "polygon",
        functions: "choropleth",
        geoserver_layer: "food_access",
        parameterKey: "data_value",
        fieldOptions: [
          {
            label: "Grocery Store Access: 1m Urban & 10m Rural",
            value: "low_access_population_urban_1_rural_10",
            parameter: ["low_access_population_urban_1_rural_10"],
            year: [2015],
            aggregation_method: "sum"
          },
          {
            label: "Grocery Store Access: 0.5m Urban & 10m Rural",
            value: "low_access_population_urban_05_rural_10",
            parameter: ["low_access_population_urban_05_rural_10"],
            year: [2015],
            aggregation_method: "sum"
          },
          {
            label: "Grocery Store Access: 1m Urban & 20m Rural",
            value: "low_access_income_population_urban_1_rural_20",
            parameter: ["low_access_income_population_urban_1_rural_20"],
            year: [2015],
            aggregation_method: "sum"
          },
          {
            label: "Population Count Beyond 0.5m from Grocery Store",
            value: "population_05_supermarket",
            parameter: ["population_05_supermarket"],
            year: [2015],
            aggregation_method: "sum"
          }
        ]
      }
    ]
  },
  {
    name: "Health Behaviors",
    options: [
      {
        name: "Health Behaviors",
        type: "radio",
        dataType: "polygon",
        functions: ["choropleth"],
        geoserver_layer: "health_behavior",
        parameterKey: "behavior",
        fieldOptions: [
          {
            label:
              "Percent adults (18+) who reported not good health (14 days)",
            value:
              "Physical health not good for >=14 days among adults aged >=18 Years",
            year: [2014, 2015, 2016],
            parameter: ["Physical"],
            aggregation_method: "average"
          },
          {
            label:
              "Percent adults (18+) without health insurance",
            value:
              "Current lack of health insurance among adults aged 18-64 Years",
            year: [2014, 2015, 2016],
            parameter: ["Health"],
            aggregation_method: "average"
          },
          {
            label: "Percent obese adults (18+) ",
            value: "Obesity among adults aged >=18 Years",
            year: [2014, 2015, 2016],
            parameter: ["Obesity"],
            aggregation_method: "average"
          },
          {
            label:
              "Percent adults (18+) who reported not good mental health (14 days)",
            value:
              "Mental health not good for >=14 days among adults aged >=18 Years",
            table_name: "health_behaviors",
            year: [2014, 2015, 2016],
            parameter: ["Mental"],
            aggregation_method: "average"
          },
          {
            label:
              "Percent adults (18+) reported annual doctor visit",
            value:
              "Visits to doctor for routine checkup within the past Year among adults aged >=18 Years",
            year: [2014, 2015, 2016],
            parameter: ["Checkup"],
            aggregation_method: "average"
          },
          {
            label: "Percent binge drinking adults (18+)",
            value: "Binge drinking among adults aged >=18 Years",
            year: [2014, 2015, 2016],
            parameter: ["Drinking"],
            aggregation_method: "average"
          },
          {
            label: "Percent current smoking adults (18+) ",
            value: "Current smoking among adults aged >=18 Years",
            year: [2014, 2015, 2016],
            parameter: ["Smoking"],
            aggregation_method: "average"
          },
          {
            label:
              "Percent adults (18+) not engaged in physical activity",
            value:
              "No leisure-time physical activity among adults aged >=18 Years",
            year: [2014, 2015, 2016],
            parameter: ["Inactivity"],
            aggregation_method: "average"
          }
        ]
      }
    ]
  },
  {
    name: "Environment",
    options: [
      {
        name: "Environmental Exposures",
        options: [
          {
            name: "Pollutant",
            type: "radio",
            dataType: "polygon",
            functions: ["choropleth"],
            geoserver_layer: "caces_pollutants",
            parameterKey: "pollutant",
            fieldOptions: [
              {
                label: "O3 (Ozone)",
                value: "Ozone",
                year: [
                  2000,
                  2001,
                  2002,
                  2003,
                  2004,
                  2005,
                  2006,
                  2007,
                  2008,
                  2009,
                  2010,
                  2011,
                  2012,
                  2013,
                  2014,
                  2015
                ],
                parameter: ["o3"],
                aggregation_method: "average"
              },
              {
                label: "CO (Carbon Monoxide)",
                value: "Carbon Monoxide",
                year: [
                  2000,
                  2001,
                  2002,
                  2003,
                  2004,
                  2005,
                  2006,
                  2007,
                  2008,
                  2009,
                  2010,
                  2011,
                  2012,
                  2013,
                  2014,
                  2015
                ],
                parameter: ["co"],
                aggregation_method: "average"
              },
              {
                label: "SO2 (Sulfur Dioxide)",
                value: "Sulfur Dioxide",
                year: [
                  2000,
                  2001,
                  2002,
                  2003,
                  2004,
                  2005,
                  2006,
                  2007,
                  2008,
                  2009,
                  2010,
                  2011,
                  2012,
                  2013,
                  2014,
                  2015
                ],
                parameter: ["so2"],
                aggregation_method: "average"
              },
              {
                label: "NO2 (Nitrous Dioxide)",
                value: "Nitrous Dioxide",
                year: [
                  2000,
                  2001,
                  2002,
                  2003,
                  2004,
                  2005,
                  2006,
                  2007,
                  2008,
                  2009,
                  2010,
                  2011,
                  2012,
                  2013,
                  2014,
                  2015
                ],
                parameter: ["no2"],
                aggregation_method: "average"
              },
              {
                label: "PM (Particulate Matter) 10",
                value: "Particulate Matter 10",
                year: [
                  2000,
                  2001,
                  2002,
                  2003,
                  2004,
                  2005,
                  2006,
                  2007,
                  2008,
                  2009,
                  2010,
                  2011,
                  2012,
                  2013,
                  2014,
                  2015
                ],
                parameter: ["pm10"],
                aggregation_method: "average"
              },
              {
                label: "PM (Particulate Matter) 2.5",
                value: "Particulate Matter 2.5",
                year: [
                  2000,
                  2001,
                  2002,
                  2003,
                  2004,
                  2005,
                  2006,
                  2007,
                  2008,
                  2009,
                  2010,
                  2011,
                  2012,
                  2013,
                  2014,
                  2015
                ],
                parameter: ["pm25"],
                aggregation_method: "average"
              }
            ]
          }
        ]
      },
      {
        name: "Satellite Imagery",
        options: [
          {
            name: "Global Landcover 2000",
            options: [
              {
                name: "Landcover Types",
                type: "radio",
                dataType: "raster",
                geoserver_layer: "glc:GLC",
                functions: ["summary", "raster_sld"],
                fieldOptions: [
                  {
                    label: "All Landcover",
                    value: "Global Landcover 2000",
                    Name: "Global Landcover 2000",
                    opacity: 1,
                    year: [2000],
                    parameter: []
                  },
                  {
                    label: "Forest",
                    value: "Forest",
                    opacity: 1,
                    year: [2000],
                    parameter: [
                      "lcbrdevgrn",
                      "lcdecidcl",
                      "lcdecidop",
                      "lcndlevgrn",
                      "lcndldecid",
                      "lcmxlftree"
                    ]
                  },
                  {
                    label: "Water",
                    value: "Water",
                    opacity: 1,
                    year: [2000],
                    parameter: ["lcwater"]
                  },
                  {
                    label: "Built Environment",
                    value: "Built Environment",
                    opacity: 1,
                    year: [2000],
                    parameter: ["lcartif"]
                  }
                  // {
                  //   label: "Bare Areas",
                  //   value: "Bare Areas",
                  //   opacity: 1,
                  //   year: [2000],
                  //   parameter: "lcbare"
                  // }
                ]
              }
            ]
          },
          {
            name: "Meris",
            options: [
              {
                name: "Landcover Types",
                type: "radio",
                dataType: "raster",
                geoserver_layer: "minnesota:MN_MERIS_YYYY",
                functions: ["summary", "raster_sld"],
                fieldOptions: [
                  {
                    label: "All Categories",
                    value: "All Categories",
                    opacity: 1,
                    year: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
                    parameter: []
                  },
                  {
                    label: "Cropland",
                    value: "Cropland",
                    opacity: 1,
                    year: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
                    parameter: [
                      "lccroprain",
                      "lccropirripofld",
                      "lcherbac",
                      "lcmocropnatvege"
                    ]
                  },
                  {
                    label: "Forest",
                    value: "Forest",
                    opacity: 1,
                    year: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
                    parameter: [
                      "lcmonatvegecrop",
                      "lctreebrevgrncto",
                      "lctreebrdecicto",
                      "lctreebrdecic",
                      "lctreebrdecio",
                      "lctreeneedevgrncto",
                      "lctreeneedevgrnc",
                      "lctreeneedevgrno",
                      "lctreeneeddecicto"
                    ]
                  },
                  {
                    label: "Water",
                    value: "Water",
                    opacity: 1,
                    year: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
                    parameter: ["lcwater"]
                  },
                  {
                    label: "Built Environment",
                    value: "Built Environment",
                    opacity: 1,
                    year: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
                    parameter: ["lcurban"]
                  },
                  {
                    label: "Bare Areas",
                    value: "Bare Areas",
                    opacity: 1,
                    year: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
                    parameter: ["lcbare"]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export { commonFields, scopedFilterFields };
