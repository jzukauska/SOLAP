SELECT gid, statefp as state_fips, countyfp as county_fips, geoid, name, geom,
ST_SimplifyPreserveTopology(geom, .1) as geom_1, ST_SimplifyPreserveTopology(geom, .2) as geom_2, ST_SimplifyPreserveTopology(geom, .3) as geom_3,
ST_SimplifyPreserveTopology(geom, .4) as geom_4, ST_SimplifyPreserveTopology(geom, .5) as geom_5
INTO MN_county_2010
FROM counties
WHERE statefp = '27'