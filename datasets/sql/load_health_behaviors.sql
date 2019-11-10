
BEGIN;

DROP TABLE IF EXISTS health_behaviors;

CREATE TABLE public.health_behaviors
(
  year bigint,
  StateAbbr text,
  StateDesc text,
  CityName text,
  GeographicLevel text,
  DataSource text,
  Category text,
  UniqueID text,
  Measure text,
  Data_Value_Unit text,
  DataValueTypeID text,
  Data_Value_Type text,
  Data_Value double precision,
  Low_Confidence_Limit double precision,
  High_Confidence_Limit double precision,
  Population2010 bigint,
  CategoryID text,
  MeasureId text,
  CityFIPS double precision,
  TractFIPS double precision,
  Short_Question_Text text
);

\COPY health_behaviors(year, stateabbr, statedesc, cityname, geographiclevel, datasource, category, UniqueID, measure, Data_Value_Unit, DataValueTypeID, Data_Value_Type, Data_Value, Low_Confidence_Limit, High_Confidence_Limit, Population2010, CategoryID, MeasureId, CityFIPS, TractFIPS, Short_Question_Text) FROM 'C:\git\SOLAP\datasets\health_2016.csv' WITH CSV HEADER;

\COPY health_behaviors(year, stateabbr, statedesc, cityname, geographiclevel, datasource, category, UniqueID, measure, Data_Value_Unit, DataValueTypeID, Data_Value_Type, Data_Value, Low_Confidence_Limit, High_Confidence_Limit, Population2010, CategoryID, MeasureId, CityFIPS, TractFIPS, Short_Question_Text) FROM 'C:\git\SOLAP\datasets\health_2017.csv' WITH CSV HEADER;

\COPY health_behaviors(year, stateabbr, statedesc, cityname, geographiclevel, datasource, category, UniqueID, measure, Data_Value_Unit, DataValueTypeID, Data_Value_Type, Data_Value, Low_Confidence_Limit, High_Confidence_Limit, Population2010, CategoryID, MeasureId, CityFIPS, TractFIPS, Short_Question_Text) FROM 'C:\git\SOLAP\datasets\health_2018.csv' WITH CSV HEADER;
END;