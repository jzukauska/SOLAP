import { quantiles } from "qquantile";
import { WFS } from "ol/format";
import StyleFunctionFromBreaks from "./OpenLayers/Style/StyleFunctionFromBreaks";

class EnumUnitData {
  constructor() {
    this.tract = {};
    this.county = {};
    this.symbolizePropName = "solap_symbolize_on";
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
   * Populate county or tract data using OL vector source features
   * Good for getting initial population fields in place
   * @param {ol/source/Vector} src
   * @param {string} field
   * @param {*} level
   */
  fieldExists(src, field, level) {
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
   * TODO make this work with equal breaks
   * Given a set of features, find class breaks for quantiles.
   * Normalization (e.g. pop density from separate fields) is
   * supported, along with a normalization multipler. Univariate
   * and bivariate cases handled. Breaks are <= upper limits.
   * @param {number} classCount number of classes to find breaks for
   * @param {number[]} vals1 list of primary values to determine breaks from
   * @param {number[]} [vals2] second property name to check values for; bivariate use
   * @returns {Object[]} one or two objects in an array with lowval and breaks
   */
  getClassBreaks(classCount, classMethod, vals1, vals2) {
    if (typeof vals2 === "undefined") {
      return [
        { minVal: Math.min(...vals1), breaks: quantiles(vals1, classCount) }
      ];
    } else {
      // always three-class/nine-class for bivariate
      return [
        { minVal: Math.min(...vals1), breaks: quantiles(vals1, 3) },
        { minVal: Math.min(...vals2), breaks: quantiles(vals2, 3) }
      ];
    }
  }

  // field (later fields) to vsualize
  // one field only for now
  async updateViz(
    level, // county or tract
    toLayer, // layer to update
    groupOptions,
    fieldOptions,
    classCount = 5,
    classMethod = "quantile"
  ) {
    console.log("updateViz");
    if (classMethod !== "quantile") {
      console.error("updateViz - only quanitle breaks supported");
      return;
    }

    if (classCount < 3 || classCount > 9) {
      console.error("updateViz - only 3-9 classes supported");
      return;
    }

    const defaultGroupOpts = {
        wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
        geoserverWorkspace: "solap",
        geoidField: "tract_geoid" // should always be tract, we aggregate up
      },
      defaultFieldOpts = [
        {
          propertyName: "total"
        }
      ];

    const optsGroup = Object.assign({}, defaultGroupOpts, groupOptions);
    const optsFields =
      typeof fieldOptions === "undefined" ? defaultFieldOpts : fieldOptions;

    // empty viewParams obj if none present
    // only the first field is checked, all fields in
    // the request should use the same viewParams
    if (!("viewParams" in optsFields[0])) {
      optsFields[0].viewParams = {};
    }

    // assume agggregation_method is "sum"
    // TODO get agg method all into filterfields
    for (let i = 0; i < optsFields.length; i++) {
      if (!("aggregation_method" in optsFields[i])) {
        optsFields[i].aggregation_method = "sum";
      }
    }

    // get normalized field names for all parameters to rekey data
    const normedNames = {};
    const normedNameAggMethod = {};
    for (let i = 0; i < optsFields.length; i++) {
      normedNames[optsFields[i].propertyName] = this.normalizeFieldName({
        geoserverWorkspace: optsGroup.geoserverWorkspace,
        geoserverLayer: optsGroup.geoserverLayer,
        field: optsFields[i].propertyName,
        viewParams:
          "viewParams" in optsFields[i] ? optsFields[i].viewParams : {}
      });
      normedNameAggMethod[normedNames[optsFields[i].propertyName]] =
        optsFields[i].aggregation_method;
    }

    // TODO add field check
    const featureData = this.getFromWFS(optsGroup, optsFields);

    // add feature data to this.tract or this.county
    await featureData.then(data => {
      // first pass, rename to normalized
      for (let geoid in data) {
        delete data[geoid][optsGroup.geoidField]; // delete extra key prop
        for (let origField in normedNames) {
          data[geoid][normedNames[origField]] = data[geoid][origField];
          delete data[geoid][origField];
        }
      }

      // add to this.tract
      for (let geoid in data) {
        this.tract[geoid] = Object.assign({}, this.tract[geoid], data[geoid]);
      }

      // TODO aggregation to county here
      // get unique geoids from tract geoids
      let countyGeoids = Array.from(
        new Set(Object.keys(data).map(x => x.slice(0, 5)))
      );

      console.log("normedNames :", normedNames);
      // for each field
      let perFieldSums, perFieldCounts, perFieldAverages;
      console.log("normedNameAggMethod :", normedNameAggMethod);
      for (let field in normedNameAggMethod) {
        console.log("aggregating field :", field);
        perFieldSums = {};
        perFieldCounts = {};
        perFieldAverages = {};
        for (let i = 0; i < countyGeoids.length; i++) {
          perFieldSums[countyGeoids[i]] = 0;
          perFieldCounts[countyGeoids[i]] = 0;
          perFieldAverages[countyGeoids[i]] = null;
        }

        // count occurences and sum to county
        for (let geoid in this.tract) {
          if (field in this.tract[geoid]) {
            console.warn("field in tract");
            perFieldSums[geoid.slice(0, 5)] += this.tract[geoid][field];
            perFieldCounts[geoid.slice(0, 5)] += 1;
          }
        }

        // populate this.county with average else sum
        if (normedNameAggMethod[field] === "average") {
          for (let geoid in perFieldCounts) {
            if (perFieldCounts[geoid] > 0) {
              perFieldAverages[geoid] =
                perFieldSums[geoid] / perFieldCounts[geoid];
            }
            this.county[geoid] = Object.assign({}, this.county[geoid], {
              [field]: perFieldAverages[geoid]
            });
          }
        } else {
          // else we use the sumsum
          for (let geoid in perFieldCounts) {
            this.county[geoid] = Object.assign({}, this.county[geoid], {
              [field]: perFieldSums[geoid]
            });
          }
        }
      }
    });

    // get array of values to determine classes from
    // TODO support multiple values, e.g. grouped pop by age by sex
    const symbolizePairs = {};
    for (let geoid in this[level]) {
      if (normedNames[optsFields[0].propertyName] in this[level][geoid]) {
        symbolizePairs[geoid] = this[level][geoid][
          normedNames[optsFields[0].propertyName]
        ];
      }
    }

    // get class breaks
    const breaks = this.getClassBreaks(
      classCount,
      classMethod,
      Object.values(symbolizePairs)
    );

    console.log("breaks :", breaks);

    // populate layer source with symbolize property
    const layerFeatures = toLayer.getSource().getFeatures();
    let lfGeoid;
    console.log("layerFeatures.length :", layerFeatures.length);
    for (let i = 0; i < layerFeatures.length; i++) {
      lfGeoid = layerFeatures[i].getProperties().geoid;
      // console.log("lfGeoid :", lfGeoid);
      if (lfGeoid in symbolizePairs) {
        await layerFeatures[i].setProperties({
          [this.symbolizePropName]: symbolizePairs[lfGeoid]
        });
      }
    }

    // style the layer
    toLayer.setStyle(
      StyleFunctionFromBreaks(breaks, { prop1Names: [this.symbolizePropName] })
    );
  }

  /**
   * Provide a normalized field name to avoid collisions
   * @param {Object} fieldInfo
   */
  normalizeFieldName(fieldInfo) {
    const fieldInfoDefaults = {
      geoserverWorkspace: null,
      geoserverLayer: null,
      field: null,
      viewParams: {}
      // viewParams: { pollutant: "so2", year: 2005 } // example
    };

    const field = Object.assign({}, fieldInfoDefaults, fieldInfo);
    let result = `${field.geoserverWorkspace}|${field.geoserverLayer}|${field.field}`;

    const vpKeys = Object.keys(field.viewParams);
    vpKeys.sort(); // ensure consistent order

    for (let i = 0; i < vpKeys.length; i++) {
      result += `|${vpKeys[i]}:${field.viewParams[vpKeys[i]]}`;
    }

    return result;
  }

  /**
   * Get data from WFS, return key on geoid with values in subobj
   * Handles parameterized (viewParams) requests, assuming all vars
   * are available for one set of viewParams
   * @param {Object} groupOptions high-level info for data to re
   * @param {Object[]} fieldOptions one or more objects representing field(s) to retrieve
   */
  async getFromWFS(optsGroup, optsFields) {
    let result = {};

    console.log("optsGroup :", optsGroup);
    console.log("optsFields :", optsFields);

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

    let featProps;
    for (let i = 0; i < theResponse.features.length; i++) {
      featProps = theResponse.features[i].properties;
      result[featProps[optsGroup.geoidField]] = Object.assign({}, featProps);
    }

    return result;
  }
}

export default new EnumUnitData();
