BEGIN;

DROP TABLE IF EXISTS caces_pollutants;

CREATE TABLE caces_pollutants (
rec_id bigint,
fips text,
pollutant text,
year integer,
value double precision,
state_abbr text
);

\COPY caces_pollutants FROM 'E:\git\SOLAP\datasets\caces_pollutants.csv' WITH CSV HEADER;


END;