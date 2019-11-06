SELECT gid, gis_join_m, state_fips, county_fip as county_fips, tract_fips, geoid, tract_name, tract_long, geom,
ST_SimplifyPreserveTopology(geom, .1) as geom_1, ST_SimplifyPreserveTopology(geom, .2) as geom_2, ST_SimplifyPreserveTopology(geom, .3) as geom_3,
ST_SimplifyPreserveTopology(geom, .4) as geom_4, ST_SimplifyPreserveTopology(geom, .5) as geom_5
INTO MN_tract_2010
FROM continental_us_tract_2010
WHERE state_fips = '27'

