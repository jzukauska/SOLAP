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
import VizDataManager from "./VizDataManager";
const VizContext = React.createContext();

// TODO:
// Fix map type change
// Get age slider working
// Get multiple (2) features working together
// Customize requests so not just defaults used

const app = {};
window.app = app;
app.lt1 = layer1Tract;
app.lt2 = layer2Tract;
app.lc1 = layer1County;
app.lc2 = layer2County;
app.dm = VizDataManager;

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
    },
    dataManager: VizDataManager
  };

  generateStyleForLegend({ title, styleData }) {
    const { variableName } = this.props;
    const legend = [];
    for (let i = 0; i < styleData[0].breaks.length; i++) {
      const data = {
        stroke:
          ColorBrewerStyles["YlGnBu"][styleData[0].breaks.length][i].fill_
            .color_,
        lowerBound: i === 0 ? styleData[0].minVal : styleData[0].breaks[i - 1],
        upperBound: styleData[0].breaks[i]
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

  handleMapChange = async ({
    name,
    value,
    yearOptions,
    groupOptions,
    fieldOptions
  }) => {
    // console.warn("<<<< HMC <<<<<<<<<<<<<<<<<<<<<<");
    // console.log("name :", name);
    // console.log("value :", value);
    // console.log("yearOptions :", yearOptions);
    // console.log("groupOptions :", groupOptions);
    // console.log("fieldOptions :", fieldOptions);
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
        return;
      }

      if (value === "Census Tracts") {
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
        return;
      }
    }
    const sampleGroupOpts1 = {
      wfsUrl: "http://149.165.157.200:8080/geoserver/wfs",
      geoserverWorkspace: "solap",
      geoserverLayer: "demographics",
      geoidField: "tract_geoid"
    };
    const sampleFieldOpts1 = [
      {
        propertyName: "total"
      }
    ];

    const currentLayerUnit =
      this.state[this.props.variableName].layers.CurrentLayer ===
        layer1County ||
      this.state[this.props.variableName].layers.CurrentLayer === layer2County
        ? "county"
        : "tract";

    await this.state.dataManager.updateViz(
      currentLayerUnit,
      this.state[this.props.variableName].layers.CurrentLayer,
      {
        geoserverLayer: groupOptions.geoserver_layer
        // geoidField: `${currentLayerUnit}_geoid`
      },
      [
        {
          propertyName:
            "parameter" in fieldOptions && fieldOptions.parameter.length === 1
              ? fieldOptions.parameter[0]
              : fieldOptions.value,
          propertyIsViewParam:
            "parameter" in fieldOptions && fieldOptions.parameter.length === 1
              ? true
              : false
        }
      ]
    );

    const lastBreaks = this.state.dataManager.lastBreaks; // array for future bivariate support
    this.generateStyleForLegend({ title: `${value}`, styleData: lastBreaks });
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
