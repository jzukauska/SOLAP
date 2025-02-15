WITH tract_data as 
(
SELECT d.*, LEFT(tg.geoid,5) as geoid, cg.geom,
cg.aland, cg.awater, cg.approxsqmi, cg.shape_leng, cg.shape_area
FROM census_tracts_2010_diversity d
INNER JOIN continental_us_tract_2010 p ON (d.gis_join_match_code = p.gis_join_m)
INNER JOIN tract_2010_carto tg ON p.geoid = tg.geoid
INNER JOIN county_2010_carto cg ON LEFT(tg.geoid,5) = cg.state || cg.county
)
SELECT geoid, geom, 
sum(total) as total,
sum(male) as male,
sum(female) as female,
sum(male_under_5_years) as male_under_5_years,
sum(male_5_to_9_years) as male_5_to_9_years,
sum(male_10_to_14_years) as male_10_to_14_years,
sum(male_15_to_17_years) as male_15_to_17_years,
sum(male_18_and_19_years) as male_18_and_19_years,
sum(male_20_years) as male_20_years,
sum(male_21_years) as male_21_years,
sum(male_22_to_24_years) as male_22_to_24_years,
sum(male_25_to_29_years) as male_25_to_29_years,
sum(male_30_to_34_years) as male_30_to_34_years,
sum(male_35_to_39_years) as male_35_to_39_years,
sum(male_40_to_44_years) as male_40_to_44_years,
sum(male_45_to_49_years) as male_45_to_49_years,
sum(male_50_to_54_years) as male_50_to_54_years,
sum(male_55_to_59_years) as male_55_to_59_years,
sum(male_60_and_61_years) as male_60_and_61_years,
sum(male_62_to_64_years) as male_62_to_64_years,
sum(male_65_and_66_years) as male_65_and_66_years,
sum(male_67_to_69_years) as male_67_to_69_years, 
sum(male_70_to_74_years) as male_70_to_74_years,
sum(male_75_to_79_years) as male_75_to_79_years,
sum(male_80_to_84_years) as male_80_to_84_years, 
sum(male_85_years_and_over) as male_85_years_and_over,
sum(female_under_5_years) as female_under_5_years,
sum(female_5_to_9_years) as female_5_to_9_years,
sum(female_10_to_14_years) as female_10_to_14_years,
sum(female_15_to_17_years) as female_15_to_17_years,
sum(female_18_and_19_years) as female_18_and_19_years,
sum(female_20_years) as female_20_years,
sum(female_21_years) as female_21_years,
sum(female_22_to_24_years) as female_22_to_24_years,
sum(female_25_to_29_years) as female_25_to_29_years,
sum(female_30_to_34_years) as female_30_to_34_years,
sum(female_35_to_39_years) as female_35_to_39_years,
sum(female_40_to_44_years) as female_40_to_44_years,
sum(female_45_to_49_years) as female_45_to_49_years,
sum(female_50_to_54_years) as female_50_to_54_years,
sum(female_55_to_59_years) as female_55_to_59_years,
sum(female_60_and_61_years) as female_60_and_61_years,
sum(female_62_to_64_years) as female_62_to_64_years,
sum(female_65_and_66_years) as female_65_and_66_years,
sum(female_67_to_69_years) as female_67_to_69_years,
sum(female_70_to_74_years) as female_70_to_74_years,
sum(female_75_to_79_years) as female_75_to_79_years,
sum(female_80_to_84_years) as female_80_to_84_years,
sum(female_85_years_and_over) as female_85_years_and_over,
sum(white_alone) as white_alone,
sum(black_alone) as black_alone,
sum(american_indian_alone) as american_indian_alone,
sum(asian_alone) as asian_alone,
sum(hawaiian_pi_alone) as hawaiian_pi_alone,
sum(sor_alone) as sor_alone,
sum(aland) as aland,
sum(awater) as awater, 
sum(approxsqmi) as approxsqmi, 
sum(shape_leng) as shape_length, 
sum(shape_area) as shape_area
FROM tract_data
GROUP BY geoid, geom