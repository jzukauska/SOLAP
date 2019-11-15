/**
 * MN tract layer
 */
import { Vector as VectorLayer } from "ol/layer";
import { GeoJSON, WFS } from "ol/format";
import MNTractSource from "./MnTractSource";
import BasicPolygon from "./Style/BasicPolygon";
import { equalTo as equalToFilter } from "ol/format/filter";
import StyleFunctionFromBreaks from "./Style/StyleFunctionFromBreaks";
import FindQuantileBreaks from "./FindQuantileBreaks";

const layer = new VectorLayer({
  name: "mn_tract_2010",
  source: MNTractSource,
  style: BasicPolygon
});

/**
 * Get properties of features from a WFS source and attach them
 * to existing features in an ol/Source/Vector (VectorSource)
 * object.
 *
 * WATCH OUT: There are promises within
 *
 * @param {Object} options
 * @param {string} options.wfsUrl
 * @param {string} options.featurePrefix prefix for feature types, e.g. GeoServer workspace name
 * @param {string} options.featureType features name, e.g. GeoServer layer names; expects only one
 * @param {string[]} options.propertyNames property names to retrieve from layer
 * @param {Object} options.vectorSourceToUpdate ol/Source/Vector with features to update/amend
 * @param {string} options.joinKeySource key field on original ol/Source/Vector to use when joining
 * @param {string} options.joinKeyExtras key field on additional propertie retrieved to use when joining
 */
layer.getFeaturePropertiesFromWfs = function(options) {
  const defaultOpts = {
    wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
    featurePrefix: "solap",
    featureType: "us_census_2010",
    propertyNames: [
      "male_under_5_years",
      "male_5_to_9_years",
      "male_10_to_14_years",
      "male_15_to_17_years",
      "male_18_and_19_years",
      "male_20_years",
      "male_21_years",
      "male_22_to_24_years",
      "male_25_to_29_years",
      "male_30_to_34_years",
      "male_35_to_39_years",
      "male_40_to_44_years",
      "male_45_to_49_years",
      "male_50_to_54_years",
      "male_55_to_59_years",
      "male_60_and_61_years",
      "male_62_to_64_years",
      "male_65_and_66_years",
      "male_67_to_69_years",
      "male_70_to_74_years",
      "male_75_to_79_years",
      "male_80_to_84_years",
      "male_85_years_and_over",
      "female_under_5_years",
      "female_5_to_9_years",
      "female_10_to_14_years",
      "female_15_to_17_years",
      "female_18_and_19_years",
      "female_20_years",
      "female_21_years",
      "female_22_to_24_years",
      "female_25_to_29_years",
      "female_30_to_34_years",
      "female_35_to_39_years",
      "female_40_to_44_years",
      "female_45_to_49_years",
      "female_50_to_54_years",
      "female_55_to_59_years",
      "female_60_and_61_years",
      "female_62_to_64_years",
      "female_65_and_66_years",
      "female_67_to_69_years",
      "female_70_to_74_years",
      "female_75_to_79_years",
      "female_80_to_84_years",
      "female_85_years_and_over",
      "white_alone",
      "black_alone",
      "american_indian_alone",
      "asian_alone",
      "hawaiian_pi_alone",
      "sor_alone"
    ],
    vectorSourceToUpdate: layer.getSource(),
    joinKeySource: "geoid",
    joinKeyExtras: "gis_join_match_code" // gis_join_match_code irregular from us_census_2010
  };

  const opts = Object.assign({}, defaultOpts, options);

  // assemble request options
  const featureRequest = new WFS().writeGetFeature({
    srsName: opts.srsName,
    featurePrefix: opts.featurePrefix,
    featureTypes: [opts.featureType],
    propertyNames: opts.propertyNames.concat(opts.joinKeyExtras), // always add the join key to the request
    outputFormat: "application/json",
    filter: equalToFilter("state_code", "27") // Minnesota only
  });

  fetch(opts.wfsUrl, {
    method: "POST",
    body: new XMLSerializer().serializeToString(featureRequest)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      const features = new GeoJSON().readFeatures(json);
      const origFeatures = opts.vectorSourceToUpdate.getFeatures();

      // index the retrieved features by joinKeyExtras
      // TODO: update to use geoid when added to extras source; no more string slicing
      const featuresIndexed = {};
      let gisJoinCode;
      let geoidExtracted;
      for (let i = 0; i < features.length; i++) {
        gisJoinCode = features[i].getProperties()[opts.joinKeyExtras];
        geoidExtracted =
          gisJoinCode.slice(1, 3) +
          gisJoinCode.slice(4, 7) +
          gisJoinCode.slice(8, 14);
        featuresIndexed[geoidExtracted] = features[i].getProperties();

        // geometry always appears in the response, need to omit or it will
        // overwrite the geometry already in the vector source
        delete featuresIndexed[geoidExtracted].geometry;
      }

      let curKey;
      for (let i = 0; i < origFeatures.length; i++) {
        curKey = origFeatures[i].getProperties()[opts.joinKeySource];
        if (curKey in featuresIndexed) {
          origFeatures[i].setProperties(
            Object.assign({}, featuresIndexed[curKey])
          );
        }
      }

      console.log("layer.getFeaturePropertiesFromWfs all resolved");
    });
};

layer.testit = function() {
  const symbolConfig = {
    classCount: 5,
    prop1Names: ["county_fips"]
  };

  console.log(
    "this.getSource().getFeatures() :",
    this.getSource().getFeatures()
  );

  console.log(
    "FindQuantileBreaks(this.getSource().getFeatures(), symbolConfig) :",
    FindQuantileBreaks(this.getSource().getFeatures(), symbolConfig)
  );
  this.setStyle(
    StyleFunctionFromBreaks(
      FindQuantileBreaks(this.getSource().getFeatures(), symbolConfig),
      symbolConfig
    )
  );
};

// TODO: remove debug helper
const app = {};
window.app = app;
app.l = layer;

export default layer;
