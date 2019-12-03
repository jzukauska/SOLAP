import React, { Component } from "react";

import { equalTo as equalToFilter } from "ol/format/filter";
import StyleFunctionFromBreaks from "./OpenLayers/Style/StyleFunctionFromBreaks";
import FindQuantileBreaks from "./OpenLayers/FindQuantileBreaks";
import { GeoJSON, WFS } from "ol/format";
import BasicPolygon from "./OpenLayers/Style/BasicPolygon";

import BasemapLayer from "./OpenLayers/BasemapLayer";
import { layer1Tract, layer2Tract } from "./OpenLayers/MnTractLayer";
import { layer1County, layer2County } from "./OpenLayers/MnCountyLayer";
import ColorBrewerStyles from "./OpenLayers/Style/ColorBrewerStyles";

const VizContext = React.createContext();

// TODO:
// Fix map type change
// Get age slider working
// Get multiple (2) features working together
// Customize requests so not just defaults used

export default class VizController extends Component {
  state = {
    firstVariable: {
      layers: {
        BasemapLayer: BasemapLayer,
        CurrentLayer: layer1County
      },
      legend: null
    },
    secondVariable: {
      layers: {
        BasemapLayer: BasemapLayer,
        CurrentLayer: layer2County
      },
      legend: null
    }
  };

  generateStyleForLegend({ title, styleData }) {
    const { variableName } = this.props;
    const legend = [];
    for (let i = 0; i < styleData[0].length; i++) {
      const data = {
        stroke:
          ColorBrewerStyles["YlGnBu"][styleData[0].length][i].fill_.color_,
        lowerBound: i === 0 ? 0 : styleData[0][i - 1],
        upperBound: styleData[0][i]
      };
      legend.push(data);
    }
    this.setState({
      [variableName]: {
        ...this.state[variableName],
        legend: { title, data: legend }
      }
    });
  }

  handleMapChange = async ({ name, value, yearOptions }) => {
    const { variableName } = this.props;
    if (name === "Geographic Unit") {
      if (value === "County") {
        this.setState(
          (state, props) => ({
            [variableName]: {
              ...state[variableName],
              layers: {
                CurrentLayer:
                  variableName === "firstVariable"
                    ? layer1County
                    : layer2County,
                BasemapLayer: BasemapLayer
              }
            }
          }),
          () => this.forceUpdate()
        );
      } else if (value === "Census Tracts") {
        this.setState(
          (state, props) => ({
            [variableName]: {
              ...state[variableName],
              layers: {
                CurrentLayer:
                  variableName === "firstVariable" ? layer1Tract : layer2Tract,
                BasemapLayer: BasemapLayer
              }
            }
          }),
          () => this.forceUpdate()
        );
      }
    } else {
      const styleData = await this.symbolizeOn({
        prop1Names: [value]
      });
      this.generateStyleForLegend({ title: `${value}`, styleData });
    }
  };

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

  symbolizeOn = async function(options, classCount = 5) {
    // are all properties required in the features? just check one feature
    const layer = this.state[this.props.variableName].layers.CurrentLayer;
    const checkFeature = layer
      .getSource()
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
        async function() {
          const symbolConfig = {
            classCount: classCount,
            prop1Names: options.prop1Names
          };

          layer.setStyle(
            StyleFunctionFromBreaks(
              FindQuantileBreaks(layer.getSource().getFeatures(), symbolConfig),
              symbolConfig
            )
          );

          return FindQuantileBreaks(
            layer.getSource().getFeatures(),
            symbolConfig
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
          FindQuantileBreaks(layer.getSource().getFeatures(), symbolConfig),
          symbolConfig
        )
      );

      return FindQuantileBreaks(layer.getSource().getFeatures(), symbolConfig);
    }
  };

  /**
   * Reset layer styling to basic polygon style
   */
  clearStyling = function() {
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
  getFeaturePropertiesFromWfs = function(options) {
    const defaultOpts = {
      wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
      featurePrefix: "solap",
      featureType: "us_census_2010",
      propertyNames: [],
      vectorSourceToUpdate: this.state[
        this.props.variableName
      ].layers.CurrentLayer.getSource(),
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

  render() {
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        layers: this.state[this.props.variableName].layers,
        legend: this.state[this.props.variableName].legend,
        handleMapChange: this.handleMapChange
      })
    );

    return (
      <VizContext.Provider
        value={{
          layers: this.state[this.props.variableName].layers,
          handleMapChange: this.handleMapChange
        }}
      >
        {children}
      </VizContext.Provider>
    );
  }
}

export const VizConsumer = VizContext.Consumer;
