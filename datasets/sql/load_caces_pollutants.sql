
BEGIN;

DROP TABLE IF EXISTS caces_pollutants;

CREATE TABLE caces_pollutants(
    rec_id serial, 
    fips text, 
    pollutant text, 
    year integer, 
    pollutant_value float, 
    state_abbr text);

\COPY caces_pollutants(fips, pollutant, year, pollutant_value, state_abbr) FROM 'C:\git\SOLAP\datasets\caces_pollutants.csv' WITH CSV HEADER;

END;