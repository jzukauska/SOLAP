/**
 * Demos of
 *   - pulling additional attributes from a WFS to attach to a vector source,
 *   - univariate symbolization of a vector source,
 *   - univariate symbolization with normalization on a vector source, and
 *   - bivariate symbolziation with optional normalization (either var) on a vector source
 */
import "@babel/polyfill"; // just for async
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
import { equalTo as equalToFilter } from "ol/format/filter";
import { PassThrough } from "stream";
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
      "version=1.1.0&request=GetFeature&typename=solap:mn_county_2010&" +
      "outputFormat=application/json&srsname=EPSG:3857"
    );
  },
  attributions: "U.S. Census Bureau",
  strategy: allStrategy //it's not that much, just grab it all
});

/**
 * Counties sourced from WFS. Retrieve them all at once.
 */
const tractSource = new VectorSource({
  format: new GeoJSON(),
  url: function(extent) {
    return (
      "http://149.165.157.200:8080/geoserver/ows?service=wfs&" +
      "version=1.1.0&request=GetFeature&typename=solap:mn_tract_2010&" +
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
 * Construct a layer from source tracts
 */
const tractLayer = new VectorLayer({
  name: "mn_counties_2010",
  source: tractSource,
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
  layers: [basemapLayer, tractLayer],
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
 * Get properties of tracts a WFS source with expected
 * tract_geoid and county_geoid attributes as keys.
 *
 * @param {Object} options
 * @param {string} options.wfsUrl
 * @param {string} options.featurePrefix prefix for feature types, e.g. GeoServer workspace name
 * @param {string} options.featureType features name, e.g. GeoServer layer names; expects only one
 * @param {string[]} options.propertyNames property names to retrieve from layer
 * @param {Object} options.viewParams key:value pairs for viewParams in request (eg, {pollutant:"so2", year: 2005})
 * @returns {Object} tracts and counties top-level keys, geoid with value below
 */
const getFeaturePropertiesFromWfs = async function(options) {
  // const defaultOpts = {
  //   wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
  //   featurePrefix: "solap",
  //   featureType: "demographics",
  //   propertyNames: ["total", "male", "female", "person_under_5_years"].concat([
  //     "tract_geoid",
  //     "county_geoid"
  //   ]),
  //   viewParams: "pollutant:so2"
  // };

  const defaultOpts = {
    wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
    featurePrefix: "solap",
    featureType: "caces_pollutants",
    propertyNames: ["data_value"],
    addlProps: ["tract_geoid", "county_geoid"], // always pull these by default
    viewParams: { pollutant: "so2", year: 2005 }
  };
  const opts = Object.assign({}, defaultOpts, options);

  // assemble request options
  const featureRequest = new WFS().writeGetFeature({
    srsName: opts.srsName,
    featurePrefix: opts.featurePrefix,
    featureTypes: [opts.featureType],
    propertyNames: opts.propertyNames.concat(opts.addlProps), // always add the join key
    viewParams: Object.keys(opts.viewParams)
      .map(x => `${x}:${opts.viewParams[x]}`)
      .join(";"), // colon-separated key:value pairs, semicolon delimited
    outputFormat: "application/json"
  });

  const response = await fetch(opts.wfsUrl, {
    method: "POST",
    body: new XMLSerializer().serializeToString(featureRequest)
  });

  const featureJson = await response.json();
  const features = new GeoJSON().readFeatures(featureJson);
  const result = { tracts: {}, counties: {} };
  let featProps;

  // populate tracts
  for (let i = 0; i < features.length; i++) {
    featProps = features[i].getProperties();
    result.tracts[featProps.tract_geoid] = featProps[opts.propertyNames[0]]; // TODO support multiple properties
  }

  // get unique county geoids
  const countyGeoids = Array.from(
    new Set(Object.keys(result.tracts).map(x => x.slice(0, 5)))
  );

  // zero placeholders for all counties
  for (let i = 0; i < countyGeoids.length; i++) {
    result.counties[countyGeoids[i]] = 0;
  }

  // sum by county
  for (let prop in result.tracts) {
    result.counties[prop.slice(0, 5)] += result.tracts[prop];
  }

  alert(
    `Retrieved attributes for ${Object.keys(result.tracts).length} tracts in ${
      Object.keys(result.counties).length
    } counties`
  );

  return result;
};

// populate additional attributes to an existing vector source
document
  .querySelector(".demo-button-add-attrs")
  .addEventListener("click", async function(e) {
    const result = await getFeaturePropertiesFromWfs(); // real implementation would need params; these are testOpts in the function def
    console.log("result :", result);
  });

class EnumUnitData {
  constructor() {
    this.tract = {};
    this.county = {};
  }

  /**
   * Populate county or tract data using OL vector source features
   * Good for getting initial population fields in place
   * @param {ol/source/Vector} src
   * @param {*} level
   */
  setupFeatures(src, level) {
    if (level !== "county" && level !== "tract") {
      console.error("level must be 'county' or 'tract'");
      return;
    }

    const feats = src.getFeatures();
    let featProps;

    for (let i = 0; i < feats.length; i++) {
      featProps = feats[i].getProperties();
      this[level][featProps.geoid] = featProps;
      delete this[level][featProps.geoid].geometry;
    }
  }

  /**
   * Get class breaks for some data
   * @param {number[]} data array of numeric values
   * @param {numbrer} classCount number of classes to divide into (3-9)
   * @param {string} classMethod "quantile" or "equalinterval" method
   * @returns {Object} keys of geoid and prop:value within
   */
  getClasses(data, classCount, classMethod) {
    if (classMethod !== "quantile") {
      console.error("getClasses - only quanitle breaks supported");
      return;
    }
    return;
  }

  /**
   * Get data from WFS, return key on geoid with values in subobj
   * Handles parameterized (viewParams) requests, assuming all vars
   * are available for one set of viewParams
   * @param {Object} groupOptions high-level info for data to re
   * @param {Object[]} fieldOptions one or more objects representing field(s) to retrieve
   */
  async getFromWFS(groupOptions, fieldOptions) {
    const defaultGroupOpts = {
        wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
        geoserverWorkspace: "solap",
        geoserverLayer: "demographics",
        geoidField: "tract_geoid"
      },
      defaultFieldOpts = [
        {
          propertyName: "total"
        }
      ];
    let result = {};

    const optsGroup = Object.assign({}, defaultGroupOpts, groupOptions);
    const optsFields =
      typeof fieldOptions === "undefined" ? defaultFieldOpts : fieldOptions;

    // empty viewParams obj if none present
    // only the first field is checked, all fields in
    // the request should use the same viewParams
    if (!("viewParams" in optsFields[0])) {
      optsFields[0].viewParams = {};
    }

    // assemble request options
    const featureRequest = new WFS().writeGetFeature({
      viewParams: false,
      featurePrefix: optsGroup.geoserverWorkspace,
      featureTypes: [optsGroup.geoserverLayer],
      propertyNames: optsFields
        .map(x => x.propertyName)
        .concat(optsGroup.geoidField), // always add the join key to the request
      viewParams: Object.keys(optsFields[0].viewParams)
        .map(x => `${x}:${optsFields[0].viewParams[x]}`)
        .join(";"), // colon-separated key:value pairs, semicolon delimited

      outputFormat: "application/json"
    });

    const theFetch = fetch(optsGroup.wfsUrl, {
      method: "POST",
      body: new XMLSerializer().serializeToString(featureRequest)
    });

    const theResponse = await theFetch.then(async function(response) {
      return response.json();
    });

    let featProps, key;
    for (let i = 0; i < theResponse.features.length; i++) {
      featProps = theResponse.features[i].properties;
      result[featProps[optsGroup.geoidField]] = Object.assign({}, featProps);
    }

    return result;
  }
}

const e = new EnumUnitData();

window.app = {};
app = window.app;
app.map = map;
app.e = e;

app.sampleGroupOpts1 = {
  wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
  geoserverWorkspace: "solap",
  geoserverLayer: "demographics",
  geoidField: "tract_geoid"
};
app.sampleFieldOpts1 = [
  {
    propertyName: "total"
  }
];

app.sampleGroupOpts2 = {
  wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
  geoserverWorkspace: "solap",
  geoserverLayer: "caces_pollutants",
  geoidField: "tract_geoid"
};
app.sampleFieldOpts2 = [
  {
    propertyName: "data_value",
    viewParams: { pollutant: "so2", year: 2005 }
  }
];
