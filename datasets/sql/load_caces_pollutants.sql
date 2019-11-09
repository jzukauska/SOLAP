
BEGIN;

\COPY caces_pollutants(index, fips, pollutant, year, pred_wght, state_abbr) FROM 'C:\git\SOLAP\datasets\caces_pollutants.csv' WITH CSV HEADER;

END;