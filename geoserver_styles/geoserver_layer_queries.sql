
-- Demographics
SELECT d.*, p.geoid as tract_geoid, 
d.state_code::text || LPAD(d.county_code::text,3,'0' ) as county_geoid, 
g.geom, g.aland, g.awater, g.approxsqmi, 
g.shape_leng as shape_length, g.shape_area
FROM census_tracts_2010_diversity d
INNER JOIN continental_us_tract_2010 p ON (d.gis_join_match_code = p.gis_join_m)
INNER JOIN tract_2010_carto g ON p.geoid = g.geoid
WHERE d.census_year = '%year%';  --2010

-- Environmental
SELECT p.fips as tract_geoid, left(p.fips,5) as county_geoid, p.pollutant, p.value as data_value, g.geom
FROM caces_pollutants p
INNER JOIN tract_2010_carto g ON p.fips = g.geoid
WHERE p.year = %year% and p.pollutant = '%pollutant%';

--- Health Behaviors
SELECT b.stateabbr, b.datasource, b.measure, b.data_value,
b.short_question_text, b.short_code, t.geom
FROM tract_2010_carto t
INNER JOIN health_behaviors b ON t.geoid = b.tractfips
WHERE b.year = %year% AND b.short_code = '%behavior%' --'Smoking'


-- Count Neighborhood
WITH mn_geometries as
(
SELECT gid, state_fips, county_fips, tract_fips, geoid, tract_name as place_name, geom, 'tract' as geom_type
FROM mn_tract_2010
UNION
SELECT gid, state_fips, county_fips, '' as tract_fips, county_fips as geoid, name as place_name, geom, 'county' as geom_type
FROM mn_county_2010
)
SELECT geoid, count(p.geom) as data_value, g.geom
FROM mn_geometries g 
INNER JOIN %resource% p on (ST_Contains(g.geom, p.geom)) -- library
WHERE geom_type = '%geom_type%' -- tract/county
GROUP BY geoid, g.geom, geom_type


