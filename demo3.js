import "ol/ol.css";
import {
  Map,
  View
} from "ol";
import Overlay from "ol/Overlay";
import {
  defaults as defaultControls,
  Attribution
} from "ol/control";
import {
  Tile as TileLayer,
  Vector as VectorLayer
} from "ol/layer";
import {
  GeoJSON,
  WFS
} from "ol/format";
import {
  all as allStrategy
} from "ol/loadingstrategy";
import {
  Vector as VectorSource,
  XYZ
} from "ol/source";
import {
  Stroke,
  Fill,
  Style
} from "ol/style";
import colorbrewer from "colorbrewer";
import {
  quantiles,
  quantileGroups
} from "qquantile";

// A CARTO basemap
const basemapLayer = new TileLayer({
  source: new XYZ({
    url: "https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution/">CartoDB</a>'
  })
});

const countySource = new VectorSource({
  format: new GeoJSON(),
  url: function (extent) {
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
 * Basic style. The transparent fill is used to catch clicks on features
 * (not in this demo). Without a fill, clicks will only register on
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

// Vector layers for use in the map
const countyLayer = new VectorLayer({
  name: "mn_counties_2010",
  source: countySource,
  style: styleBasicPolygon
});

// Setup the attribution on layers
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
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

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

// attribution: collapse if needed
const checkSize = function () {
  var small = map.getSize()[0] < 600;
  attribution.setCollapsible(small);
  attribution.setCollapsed(small);
};
window.addEventListener("resize", checkSize);
checkSize();

/**
 * Get properties of features from a WFS source
 */
const getFeaturePropertiesFromWfs = function (options) {
  const defaults = {
    srsName: "EPSG:3857",
    outputFormat: "application/json"
  };

  const testOpts = {
    wfsUrl: "https://us-geoserver-tst-app-01.oit.umn.edu/geoserver/wfs",
    featurePrefix: "solap_test",
    featureTypes: ["tl_2010_27_county10_4326"],
    propertyNames: ["H7V001_sf", "ALAND10", "AWATER10"],
    vectorSourceToUpdate: countySource,
    joinKeySource: "geoid",
    joinKeyExtras: "GEOID10"
  };
  const opts = Object.assign({}, defaults, testOpts, options);

  // assemble request options
  const featureRequest = new WFS().writeGetFeature({
    srsName: opts.srsName,
    featurePrefix: opts.featurePrefix,
    featureTypes: opts.featureTypes,
    propertyNames: opts.propertyNames.concat(opts.joinKeyExtras), // always add the join key
    outputFormat: opts.outputFormat
  });

  fetch(opts.wfsUrl, {
      method: "POST",
      body: new XMLSerializer().serializeToString(featureRequest)
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const features = new GeoJSON().readFeatures(json);
      const origFeatures = opts.vectorSourceToUpdate.getFeatures();

      console.log(
        "A feature's properties before attaching additional attributes:",
        origFeatures[0].getProperties()
      );

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

      console.log(
        "A feature's properties after attachng additional attributes:",
        origFeatures[0].getProperties()
      );

      alert("Attributes added/replaced.");
    });
};

// populate additional attributes to an existing vector source
document.querySelector(".demo-button-add-attrs").addEventListener("click", function (e) {
  getFeaturePropertiesFromWfs(); // real implementation would need params; these are testOpts in the function def
});

// style based on county FIPS codes, five classes
document.querySelector(".demo-button-symbolize-county-fips").addEventListener("click", function (e) {
  countyLayer.setStyle(styleFunctionFromBreaks(findQuantileBreaks(countySource.getFeatures(), 5, "county_fips"), "county_fips"))
});

// style based on total population, five classes
document.querySelector(".demo-button-symbolize-population").addEventListener("click", function (e) {
  const aoi = "H7V001_sf"
  if (aoi in countySource.getFeatures()[0].getProperties()) {
    countyLayer.setStyle(styleFunctionFromBreaks(findQuantileBreaks(countySource.getFeatures(), 5, aoi), aoi))
  } else {
    alert("Need to add more attributes before symbolzing by population")
  }
});

// style based on population density, five classes
document.querySelector(".demo-button-symbolize-population-density").addEventListener("click", function (e) {
  const aoi = "H7V001_sf",
    normer = "ALAND10";
  if (aoi in countySource.getFeatures()[0].getProperties() && normer in countySource.getFeatures()[0].getProperties()) {
    countyLayer.setStyle(styleFunctionFromBreaks(findQuantileBreaks(countySource.getFeatures(), 5, aoi, normer), aoi, normer), )
  } else {
    alert("Need to add more attributes before symbolzing by population")
  }
});

window.app = {};
app = window.app;
app.map = map;
app.cs = countySource;
app.cl = countyLayer;
app.gfp = getFeaturePropertiesFromWfs;

/**
 * Add a click handler to the map to render the popup for counties
 */
map.on("singleclick", function (evt) {
  const coordinate = evt.coordinate;

  const features = app.map.getFeaturesAtPixel(evt.pixel, {
    layerFilter: function (l) {
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

const findQuantileBreaks = function (features, classCount, propName, propNormalizeName, normalizeMultiplier = 1) {
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
          `skipping a feature missing property ${propName} in findQuantileBreaks`
        );
      }
    } else {
      if (propName in featProps && propNormalizeName in featProps) {
        values.push(normalizeMultiplier * parseFloat(featProps[propName]) / parseFloat(featProps[propNormalizeName]));
      } else {
        console.warn(
          `skipping a feature missing either or both of ${propName} and ${propNormalizeName} in findQuantileBreaks`
        );
      }
    }
  }
  console.log("values :", values);
  return quantiles(values, classCount);
};

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

/**
 * Return a custom style function using a ColorBrewer ramp
 * @param {*} breaks
 * @param {*} propName
 * @param {*} rampId
 */
const styleFunctionFromBreaks = function (breaks, propName, propNormalizeName, normalizeMultiplier = 1, rampId = "YlGnBu") {
  return function (feature) {
    let testVal,
      featProps = feature.getProperties(),
      numClasses = breaks.length;

    if (typeof propNormalizeName === "undefined") {
      testVal = featProps[propName]
    } else {
      testVal = featProps[propName] / featProps[propNormalizeName] * normalizeMultiplier;
    }


    for (let i = 0; i < numClasses; i++) {
      if (testVal <= breaks[i]) {
        return brewerStyles[rampId][numClasses][i];
      }
    }
  };
};

app.quantiles = quantiles;
app.fqb = findQuantileBreaks;
app.sf = styleFunctionFromBreaks;
app.s = brewerStyles;
app.c = colorbrewer;