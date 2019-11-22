BEGIN ;

DROP TABLE IF EXISTS food_access;

CREATE TABLE food_access 
(
geoid text,
state_name text,
county_name text,
urban boolean,
housing_units integer,
low_vehicle_access boolean,
low_income_tract boolean,
poverty_rate float,
median_family_income bigint,
low_access_population_urban_1_rural_10 double precision,
low_access_population_urban_05_rural_10 double precision,
low_access_population_urban_1_rural_20 double precision,
low_access_income_population_urban_1_rural_10 double precision,
low_access_income_population_urban_05_rural_10 double precision,
low_access_income_population_urban_1_rural_20 double precision,
population_05_supermarket double precision,
population_share_05_supermarket double precision,
kids_05_supermarket double precision,
kids_share_05_supermarket double precision,
seniors_05_supermarket double precision,
seniors_share_05_supermarket double precision,
housing_units_without_vehicle integer,
housing_units_snap_benefits integer
);

\COPY food_access FROM 'E:\git\SOLAP\datasets\food_access.csv' WITH CSV HEADER;

END;