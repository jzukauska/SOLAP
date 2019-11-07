DROP TABLE IF EXISTS MN_county_2010;
SELECT gid, statefp as state_fips, countyfp as county_fips, geoid, name, geom,
ST_SimplifyPreserveTopology(geom, .01) as geom_1, ST_SimplifyPreserveTopology(geom, .02) as geom_2, ST_SimplifyPreserveTopology(geom, .03) as geom_3,
ST_SimplifyPreserveTopology(geom, .04) as geom_4, ST_SimplifyPreserveTopology(geom, .05) as geom_5
INTO MN_county_2010
FROM counties
WHERE statefp = '27'