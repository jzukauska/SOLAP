/**
 * Demos of
 *   - pulling additional attributes from a WFS to attach to a vector source,
 *   - univariate symbolization of a vector source,
 *   - univariate symbolization with normalization on a vector source, and
 *   - bivariate symbolziation with optional normalization (either var) on a vector source
 */

import "ol/ol.css";
import { Map, View } from "ol";
import Overlay from "ol/Overlay";
import { defaults as defaultControls, Attribution } from "ol/control";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { GeoJSON, WFS } from "ol/format";
import { all as allStrategy } from "ol/loadingstrategy";
import { Vector as VectorSource, XYZ } from "ol/source";
import { Stroke, Fill, Style } from "ol/style";
import colorbrewer from "colorbrewer";
import { quantiles, quantileGroups } from "qquantile";

/**
 * A CARTO basemap
 */
const basemapLayer = new TileLayer({
  source: new XYZ({
    url:
      "https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attributions:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution/">CartoDB</a>'
  })
});

/**
 * Counties sourced from WFS. Retrieve them all at once.
 */
const countySource = new VectorSource({
  format: new GeoJSON(),
  url: function(extent) {
    return (
      "http://149.165.157.200:8080/geoserver/ows?service=wfs&" +
      "version=1.1.0&request=GetFeature&typename=solap:mn_county_2010_1&" +
      "outputFormat=application/json&srsname=EPSG:3857"
    );
  },
  attributions: "U.S. Census Bureau",
  strategy: allStrategy //it's not that much, just grab it all
});

/**
 * Basic polygon. The transparent fill is used to catch clicks on features
 * (not in this demo). Note that without a fill, clicks will only register on
 * feature boundaries/strokes.
 */
const styleBasicPolygon = new Style({
  stroke: new Stroke({
    color: "rgba(0, 0, 0, 1.0)",
    width: 1
  }),
  fill: new Fill({
    color: "transparent"
  })
});

/**
 * Construct a layer from source counties
 */
const countyLayer = new VectorLayer({
  name: "mn_counties_2010",
  source: countySource,
  style: styleBasicPolygon
});

/**
 * Start of attributions setup.
 * https://openlayers.org/en/latest/examples/attributions.html
 */
const attribution = new Attribution({
  collapsible: false
});

/**
 * Popup
 * https://openlayers.org/en/latest/examples/popup.html?q=overlay
 */
var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

/**
 * The map. Note the use of overlays option for use with
 * popups and the controls option to add the attributions
 * control.
 */
const map = new Map({
  target: "map",
  layers: [basemapLayer, countyLayer],
  view: new View({
    center: [-10440000, 5693000],
    zoom: 6
  }),
  overlays: [overlay],
  controls: defaultControls({
    attribution: false
  }).extend([attribution])
});

/**
 * Attributions setup to collapse if map is small
 */
const checkSize = function() {
  var small = map.getSize()[0] < 600;
  attribution.setCollapsible(small);
  attribution.setCollapsed(small);
};
window.addEventListener("resize", checkSize);
checkSize();

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
const getFeaturePropertiesFromWfs = function(options) {
  const defaultOpts = {
    wfsUrl: "https://us-geoserver-tst-app-01.oit.umn.edu/geoserver/wfs",
    featurePrefix: "solap_test",
    featureType: "tl_2010_27_county10_4326",
    propertyNames: ["H7V001_sf", "ALAND10", "AWATER10"],
    vectorSourceToUpdate: countySource,
    joinKeySource: "geoid",
    joinKeyExtras: "GEOID10"
  };
  const opts = Object.assign({}, defaultOpts, options);

  // assemble request options
  const featureRequest = new WFS().writeGetFeature({
    srsName: opts.srsName,
    featurePrefix: opts.featurePrefix,
    featureTypes: [opts.featureType],
    propertyNames: opts.propertyNames.concat(opts.joinKeyExtras), // always add the join key
    outputFormat: "application/json"
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
      const featuresIndexed = {};
      for (let i = 0; i < features.length; i++) {
        featuresIndexed[
          features[i].getProperties()[opts.joinKeyExtras]
        ] = features[i].getProperties();

        // geometry always appears in the response, need to omit or it will
        // overwrite the geometry already in the vector source
        delete featuresIndexed[features[i].getProperties()[opts.joinKeyExtras]]
          .geometry;
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

      alert("Attributes added/replaced.");
    });
};

/**
 * Popups for counties
 */
map.on("singleclick", function(evt) {
  const coordinate = evt.coordinate;

  const features = app.map.getFeaturesAtPixel(evt.pixel, {
    layerFilter: function(l) {
      if (l.getProperties().name == "mn_counties_2010") {
        return true;
      } else {
        return false;
      }
    }
  });

  if (features.length === 0) {
    return;
  }

  if (features.length > 1) {
    content.innerHTML = "<p>Multiple features in range of click</p>";
  }

  if (features.length === 1) {
    const featProps = features[0].getProperties();
    let propContent = "<p>";
    for (const prop in featProps) {
      if (prop == "geometry") {
        continue;
      }
      propContent += `<strong>${prop}</strong>: ${featProps[prop]}<br>`;
    }
    propContent += "</p>";
    content.innerHTML = propContent;
  }
  overlay.setPosition(coordinate);
});

/**
 * Create Styles from a set of ColorBrewer ramps ready for use.
 * No need to keep generating new styles for features.
 */
const brewerStyles = {};
for (const rampId in colorbrewer) {
  if (rampId === "schemeGroups") {
    continue;
  }

  brewerStyles[rampId] = {};

  for (const rampSize in colorbrewer[rampId]) {
    brewerStyles[rampId][rampSize] = [];
    for (let i = 0; i < colorbrewer[rampId][rampSize].length; i++) {
      brewerStyles[rampId][rampSize].push(
        new Style({
          stroke: new Stroke({
            color: "#000",
            width: 1
          }),
          fill: new Fill({
            color: colorbrewer[rampId][rampSize][i]
          })
        })
      );
    }
  }
}

// build a biviarate set of styles from the third of four options at
// https://www.joshuastevens.net/cartography/make-a-bivariate-choropleth-map/
// first level is rows bottom to top (low to high), second columns left-to-right (low to high)
const bivariateColors = [
  ["#e8e8e8", "#b5c0da", "#6c83b5"], // low row
  ["#b8dfbe", "#90b2b3", "#567994"], // medium row
  ["#73ae80", "#5a9178", "#2a5a5b"] // high row
];

// this was the first of the four opts
// const bivariateColors = [
//   ["#e8e8e8", "#e4acac", "#c85a5a"], // low row
//   ["#b0d5df", "#ad9ea5", "#985356"], // medium row
//   ["#64acbe", "#627f8c", "#574249"] // high row
// ];

const bivariateStyles = {};
for (let r = 0; r < bivariateColors.length; r++) {
  bivariateStyles[r] = {};
  for (let c = 0; c < bivariateColors[r].length; c++) {
    bivariateStyles[r][c] = new Style({
      stroke: new Stroke({
        color: "#000",
        width: 1
      }),
      fill: new Fill({
        color: bivariateColors[r][c]
      })
    });
  }
}

/**
 * Given a set of features, find class breaks for quantiles.
 * Normalization (e.g. pop density from separate fields) is
 * supported, along with a normalization multipler. Univariate
 * and bivariate cases handled. Breaks are <= upper limits.
 * @param {Object[]} features array of OpenLayers features
 * @param {Object} options config options
 * @param {number} options.classCount number of classes to find breaks for
 * @param {string} options.prop1Name primary property name to check values for
 * @param {string} [options.prop1NormalizeName] optional property name to divide by (normalization)
 * @param {string} [options.prop1NormalizeMultiplier=1] multiply primary values by this factor when normalizing (e.g,, convert square meters to square kilometers)
 * @param {string} [options.prop2Name] second property name to check values for; bivariate use
 * @param {string} [options.prop2NormalizeName] optional property name to divide by (normalization of secondary values)
 * @param {string} [options.prop2NormalizeMultiplier=1] multiply secondary values by this factor when normalizing (e.g,, convert square meters to square kilometers)
 */
const findQuantileBreaks = function(features, options) {
  const defaultOpts = {
    classCount: undefined,
    prop1Name: undefined,
    prop1NormalizeName: undefined,
    prop1NormalizeMultiplier: 1,
    prop2Name: undefined,
    prop2NormalizeName: undefined,
    prop2NormalizeMultipler: undefined
  };
  const opts = Object.assign({}, defaultOpts, options);
  let values1, values2;

  values1 = getSymbolizationValueList(
    features,
    opts.prop1Name,
    opts.prop1NormalizeName,
    opts.prop1NormalizeMultiplier
  );

  if (typeof opts.prop2Name !== "undefined") {
    values2 = getSymbolizationValueList(
      features,
      opts.prop2Name,
      opts.prop2NormalizeName,
      opts.prop2NormalizeMultiplier
    );
  }

  if (!values2) {
    return [quantiles(values1, opts.classCount)];
  } else {
    // always three-class/nine-class for bivariate
    return [quantiles(values1, 3), quantiles(values2, 3)];
  }
};

/**
 * Extract values from features from a single property, from
 * two properties (divide-by, e.g. area normalization), or
 * from two properties multiplied by some factor.
 * @param {Object[]} features array of OpenLayers features
 * @param {string} propName property name to check
 * @param {string} [propNormalizeName] property name to normalize using (divide by)
 * @param {string} [propNormalizeMultiplier=1] multiply values by this (only when also normalizing)
 */
const getSymbolizationValueList = function(
  features,
  propName,
  propNormalizeName,
  propNormalizeMultiplier
) {
  const values = [];
  let featProps;
  for (let i = 0; i < features.length; i++) {
    featProps = features[i].getProperties();

    if (typeof propNormalizeName === "undefined") {
      // no additional normalization
      if (propName in featProps) {
        values.push(parseFloat(featProps[propName]));
      } else {
        console.warn(
          `skipping a feature missing property ${propName} in getSymbolizationValueList`
        );
      }
    } else {
      if (propName in featProps && propNormalizeName in featProps) {
        values.push(
          (propNormalizeMultiplier * parseFloat(featProps[propName])) /
            parseFloat(featProps[propNormalizeName])
        );
      } else {
        console.warn(
          `skipping a feature missing either or both of ${propName} and ${propNormalizeName} in getSymbolizationValueList`
        );
      }
    }
  }

  return values;
};

/**
 * Return a custom style function using a ColorBrewer ramp for univariate
 * and a single-option set of colors (3x3) for bivariate cases.
 * @param {string[][]} breaks one-item or two-item array of class breaks (high end, <=)
 * @param {Object} options config options
 * @param {string} options.prop1Name primary property name to check values for
 * @param {string} [options.prop1NormalizeName] optional property name to divide by (normalization)
 * @param {string} [options.prop1NormalizeMultiplier=1] multiply primary values by this factor when normalizing (e.g,, convert square meters to square kilometers)
 * @param {string} [options.prop2Name] second property name to check values for; bivariate use
 * @param {string} [options.prop2NormalizeName] optional property name to divide by (normalization of secondary values)
 * @param {string} [options.prop2NormalizeMultiplier=1] multiply secondary values by this factor when normalizing (e.g,, convert square meters to square kilometers)
 * @param {string} [options.colorbrewerRampId=YlGnBu] ColorBrewer ramp ID to use for univariate cases
 */
const styleFunctionFromBreaks = function(breaks, options) {
  const defaultOpts = {
    prop1Name: undefined,
    prop1NormalizeName: undefined,
    prop1NormalizeMultiplier: 1,
    prop2Name: undefined,
    prop2NormalizeName: undefined,
    prop2NormalizeMultipler: undefined,
    colorbrewerRampId: "YlGnBu"
  };

  const opts = Object.assign({}, defaultOpts, options);

  // univariate
  if (breaks.length === 1) {
    return function(feature) {
      let testVal,
        featProps = feature.getProperties(),
        numClasses = breaks[0].length;

      if (typeof opts.prop1NormalizeName === "undefined") {
        testVal = featProps[opts.prop1Name];
      } else {
        testVal =
          (featProps[opts.prop1Name] / featProps[opts.prop1NormalizeName]) *
          opts.prop1NormalizeMultiplier;
      }

      for (let i = 0; i < numClasses; i++) {
        if (testVal <= breaks[0][i]) {
          return brewerStyles[opts.colorbrewerRampId][numClasses][i];
        }
      }
    };
  }

  // bivariate, always three classes
  if (breaks.length === 2) {
    return function(feature) {
      let testVal1,
        testVal2,
        featProps = feature.getProperties(),
        numClasses = 3;

      if (typeof opts.prop1NormalizeName === "undefined") {
        testVal1 = featProps[opts.prop1Name];
      } else {
        testVal1 =
          (featProps[opts.prop1Name] / featProps[opts.prop1NormalizeName]) *
          opts.prop1NormalizeMultiplier;
      }

      if (typeof opts.prop2NormalizeName === "undefined") {
        testVal2 = featProps[opts.prop2Name];
      } else {
        testVal2 =
          (featProps[opts.prop2Name] / featProps[opts.prop2NormalizeName]) *
          opts.prop2NormalizeMultiplier;
      }

      for (let i = 0; i < numClasses; i++) {
        if (testVal1 <= breaks[0][i]) {
          for (let j = 0; j < numClasses; j++) {
            if (testVal2 <= breaks[1][j]) {
              return bivariateStyles[i][j];
            }
          }
        }
      }
    };
  }
};

/**
 * Census API request and add to county features
 *
 * The Census API returns an array of arrays, with the first array
 * being the header. Long GEO_IDs are offered and needed to be cut.
 *
 * Assumes the first column is GEO_ID
 *
 */
const addCensusDataDemo = function() {
  const censusUrl =
    "https://api.census.gov/data/2017/acs/acs5?key=7d80d73f60739990cbd1565a9638eb53b98dda95&get=GEO_ID,NAME,B01003_001E,B19013_001E&for=county:*&in=state:27";

  var request = new XMLHttpRequest();
  request.open("GET", censusUrl, true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      const censusData = JSON.parse(this.response);
      const origFeatures = countySource.getFeatures();
      const fieldsOfInterest = ["B01003_001E", "B19013_001E"];
      app.censusData = censusData; // debug helper

      // find array indices for fields of interest
      const featuresHeader = censusData[0];
      const fieldIndex = {};
      for (let i = 0; i < featuresHeader.length; i++) {
        for (let fi = 0; fi < fieldsOfInterest.length; fi++) {
          if (featuresHeader.indexOf(fieldsOfInterest[fi]) !== -1) {
            fieldIndex[fieldsOfInterest[fi]] = featuresHeader.indexOf(
              fieldsOfInterest[fi]
            );
          }
        }
      }

      // index new attributes by geoid; start at 1 to skip header
      const featuresIndexed = {};
      app.featuresIndexed = featuresIndexed;
      for (let i = 1; i < censusData.length; i++) {
        featuresIndexed[censusData[i][0].slice(-5)] = {};
        for (let prop in fieldIndex) {
          featuresIndexed[censusData[i][0].slice(-5)][prop] =
            censusData[i][fieldIndex[prop]];
        }
      }

      let curKey;
      for (let i = 0; i < origFeatures.length; i++) {
        curKey = origFeatures[i].getProperties()["geoid"];
        if (curKey in featuresIndexed) {
          origFeatures[i].setProperties(
            Object.assign({}, featuresIndexed[curKey])
          );
        }
      }

      const symbolConfig = {
        classCount: 5,
        prop1Name: "B01003_001E"
      };

      if (
        symbolConfig.prop1Name in countySource.getFeatures()[0].getProperties()
      ) {
        countyLayer.setStyle(
          styleFunctionFromBreaks(
            findQuantileBreaks(countySource.getFeatures(), symbolConfig),
            symbolConfig
          )
        );
      }

      alert("Census API data loaded for counties; symbolizing on B01003_001E");
    }
  };

  request.onerror = function() {
    alert("Error retrieving data from Census API. URL used: " + censusUrl);
  };

  request.send();
};

// populate additional attributes to an existing vector source
document
  .querySelector(".demo-button-add-attrs")
  .addEventListener("click", function(e) {
    getFeaturePropertiesFromWfs(); // real implementation would need params; these are testOpts in the function def
  });

// style based on county FIPS codes, five classes
document
  .querySelector(".demo-button-symbolize-county-fips")
  .addEventListener("click", function(e) {
    const symbolConfig = {
      classCount: 5,
      prop1Name: "county_fips"
    };

    countyLayer.setStyle(
      styleFunctionFromBreaks(
        findQuantileBreaks(countySource.getFeatures(), symbolConfig),
        symbolConfig
      )
    );
  });

// style based on total population, five classes
document
  .querySelector(".demo-button-symbolize-population")
  .addEventListener("click", function(e) {
    const symbolConfig = {
      classCount: 5,
      prop1Name: "H7V001_sf"
    };

    if (
      symbolConfig.prop1Name in countySource.getFeatures()[0].getProperties()
    ) {
      countyLayer.setStyle(
        styleFunctionFromBreaks(
          findQuantileBreaks(countySource.getFeatures(), symbolConfig),
          symbolConfig
        )
      );
    } else {
      alert("Need to add more attributes before symbolzing by population");
    }
  });

// style based on population density, five classes
document
  .querySelector(".demo-button-symbolize-population-density")
  .addEventListener("click", function(e) {
    const symbolConfig = {
      classCount: 5,
      prop1Name: "H7V001_sf",
      prop1NormalizeName: "ALAND10"
    };
    if (
      symbolConfig.prop1Name in countySource.getFeatures()[0].getProperties() &&
      symbolConfig.prop1NormalizeName in
        countySource.getFeatures()[0].getProperties()
    ) {
      countyLayer.setStyle(
        styleFunctionFromBreaks(
          findQuantileBreaks(countySource.getFeatures(), symbolConfig),
          symbolConfig
        )
      );
    } else {
      alert("Need to add more attributes before symbolzing by population");
    }
  });

// bivariate on total population and land area
document
  .querySelector(".demo-button-symbolize-bivariate")
  .addEventListener("click", function(e) {
    const symbolConfig = {
      classCount: 3,
      prop1Name: "H7V001_sf",
      prop2Name: "ALAND10"
    };
    if (
      symbolConfig.prop1Name in countySource.getFeatures()[0].getProperties() &&
      symbolConfig.prop2Name in countySource.getFeatures()[0].getProperties()
    ) {
      countyLayer.setStyle(
        styleFunctionFromBreaks(
          findQuantileBreaks(countySource.getFeatures(), symbolConfig),
          symbolConfig
        )
      );
    } else {
      alert("Need to add more attributes before symbolzing by population");
    }
  });

// add Census API attributes
document
  .querySelector(".demo-button-add-attrs-census")
  .addEventListener("click", function(e) {
    addCensusDataDemo();
  });

window.app = {};
app = window.app;
app.map = map;
