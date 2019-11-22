BEGIN ;

DROP TABLE IF EXISTS census_population;

CREATE TABLE census_population 
(
gis_join_match_code text,
census_year integer,
state_name text ,
state_code integer,
state_code_2 integer,
county_name text,
county_code integer,
county_code2 integer,
census_tract_code text,
place_name text,
total integer,
male integer,
female integer,
person_under_5_years integer,
person_5_to_9_years integer,
person_10_to_14_years integer,
person_15_to_17_years integer,
person_18_and_19_years integer,
person_20_years integer,
person_21_years integer,
person_22_to_24_years integer,
person_25_to_29_years integer,
person_30_to_34_years integer,
person_35_to_44_years integer,
person_45_to_54_years integer,
person_55_to_59_years integer,
person_60_to_61_years integer,
person_62_to_64_years integer,
person_65_to_74_years integer,
person_75_to_84_years integer,
person_85_years_and_over integer,
white_alone integer,
black_alone integer,
american_indian_alone integer,
asian_alone integer
);

\COPY census_population FROM 'E:\git\SOLAP\datasets\census_population_data_2000_2010.csv' WITH CSV HEADER;

END;