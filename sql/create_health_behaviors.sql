BEGIN;

ALTER TABLE health_behaviours_2016 RENAME TO health_behaviours;

\COPY health_behaviours FROM 'E:\git\SOLAP\datasets\health_2016.csv' WITH CSV HEADER;
\COPY health_behaviours FROM 'E:\git\SOLAP\datasets\health_2017.csv' WITH CSV HEADER;
\COPY health_behaviours FROM 'E:\git\SOLAP\datasets\health_2018.csv' WITH CSV HEADER;

END;