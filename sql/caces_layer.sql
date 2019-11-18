SELECT p.*, g.geom
FROM caces_pollutants p
INNER JOIN tract_2010_carto g ON p.fips = g.geoid
WHERE year = 2015 and pollutant = 'no2'