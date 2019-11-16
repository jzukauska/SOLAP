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
 * Symbolize the layer using one or more properties
 *
 * TODO: There are promises within that should have additional handling (loading mask, spinner, something)
 * TODO: Bivariate support (passes thru)
 * TODO: Area-normalization support (passes thru)
 *
 * @param {Object} options symbolization options
 * @param {string[]} options.prop1Names one or more attributes to sum to get the value of a feature
 * @param {number} classCount number of classes to break data into
 */
layer.symbolizeOn = function(options, classCount = 5) {
  // are all properties required in the features? just check one feature
  const checkFeature = this.getSource()
    .getFeatures()[0]
    .getProperties();
  const propsNeeded = !options.prop1Names.every(
    propName => propName in checkFeature
  );

  // if any properties are need get them all, even if some already exist
  if (propsNeeded) {
    this.getFeaturePropertiesFromWfs({
      propertyNames: options.prop1Names
    }).then(
      function() {
        const symbolConfig = {
          classCount: classCount,
          prop1Names: options.prop1Names
        };

        layer.setStyle(
          StyleFunctionFromBreaks(
            FindQuantileBreaks(this.getSource().getFeatures(), symbolConfig),
            symbolConfig
          )
        );
      }.bind(this)
    );
  } else {
    const symbolConfig = {
      classCount: classCount,
      prop1Names: options.prop1Names
    };

    layer.setStyle(
      StyleFunctionFromBreaks(
        FindQuantileBreaks(this.getSource().getFeatures(), symbolConfig),
        symbolConfig
      )
    );
  }
};

/**
 * Reset layer styling to basic polygon style
 */
layer.clearStyling = function() {
  this.setStyle(BasicPolygon);
};

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
    propertyNames: [],
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

  const theFetch = fetch(opts.wfsUrl, {
    method: "POST",
    body: new XMLSerializer().serializeToString(featureRequest)
  });

  const theResponse = theFetch.then(function(response) {
    return response.json();
  });

  const theJoin = theResponse.then(function(json) {
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
  });

  return theJoin;
};

// TODO: remove debug helper
const app = {};
window.app = app;
app.l = layer;

export default layer;
