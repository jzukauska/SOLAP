SELECT d.*, p.geoid, g.geom, g.approxsqmi, g.shape_leng as shape_length, g.shape_area
FROM census_tracts_2000_diversity d
INNER JOIN continental_us_tract_2000 p ON (d.gis_join_match_code = p.gis_join_m)
INNER JOIN tract_2000_carto g ON p.geoid = g.geoid