import React, { Component } from "react";

import BasemapLayer from "./OpenLayers/BasemapLayer";
import { layer1Tract, layer2Tract } from "./OpenLayers/MnTractLayer";
import { layer1County, layer2County } from "./OpenLayers/MnCountyLayer";
import { layer1Image, layer2Image } from "./OpenLayers/ImageLayers";
import ColorBrewerStyles from "./OpenLayers/Style/ColorBrewerStyles";
import VizDataManager from "./VizDataManager";
import BasicPolygon from "./OpenLayers/Style/BasicPolygon";
import { layer1Meris, layer2Meris } from "./OpenLayers/MerisLandCover";
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
app.il1 = layer1Image;
app.il2 = layer2Image;
app.ml1 = layer1Meris;
app.ml2 = layer2Meris;
app.dm = VizDataManager;

export default class VizController extends Component {
  state = {
    firstVariable: {
      layers: {
        BasemapLayer: BasemapLayer,
        CurrentLayer: layer1County
      },
      legend: null,
      prevEnumLayer: layer1County
    },
    secondVariable: {
      layers: {
        BasemapLayer: BasemapLayer,
        CurrentLayer: layer2County
      },
      legend: null,
      prevEnumLayer: layer2County
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
    fieldOptions,
    clearMap
  }) => {
    // console.warn("<<<< HMC <<<<<<<<<<<<<<<<<<<<<<");
    // console.log("name :", name);
    // console.log("value :", value);
    // console.log("yearOptions :", yearOptions);
    // console.log("groupOptions :", groupOptions);
    // console.log("fieldOptions :", fieldOptions);
    const { variableName } = this.props;

    // reset the current variable to county map, set basic style, remove legend
    if (typeof clearMap !== "undefined" && clearMap) {
      variableName === "firstVariable"
        ? layer1County.setStyle(BasicPolygon)
        : layer2County.setStyle(BasicPolygon);
      this.setState(
        (state, props) => ({
          [variableName]: {
            ...state[variableName],
            layers: {
              CurrentLayer:
                variableName === "firstVariable" ? layer1County : layer2County,
              BasemapLayer: BasemapLayer
            },
            legend: null
          }
        }),
        () => this.forceUpdate()
      );
      return;
    }

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
              },
              prevEnumLayer:
                variableName === "firstVariable" ? layer1County : layer2County
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
              },
              prevEnumLayer:
                variableName === "firstVariable" ? layer1Tract : layer2Tract
            }
          }),
          () => this.forceUpdate()
        );
        return;
      }
    }

    // point features and heatmaps
    if (
      "dataType" in groupOptions &&
      groupOptions.dataType === "point" &&
      (groupOptions.name === "Points" || groupOptions.name === "HeatMap")
    ) {
      const imageLayer =
        variableName === "firstVariable" ? layer1Image : layer2Image;

      if (groupOptions.name === "Points") {
        imageLayer.getSource().updateParams({
          LAYERS: "solap:" + fieldOptions.geoserver_layer,
          STYLES: null
        });
      } else if (groupOptions.name === "HeatMap") {
        imageLayer.getSource().updateParams({
          LAYERS: "solap:" + fieldOptions.geoserver_layer,
          STYLES: "heatmap"
        });
      }

      // TODO no point if previously set?
      // update state to use image layer
      this.setState(
        (state, props) => ({
          [variableName]: {
            ...state[variableName],
            layers: {
              CurrentLayer: imageLayer,
              BasemapLayer: BasemapLayer
            },
            legend: null,
            prevEnumLayer: this.state[variableName].prevEnumLayer
          }
        }),
        () => this.forceUpdate()
      );
      return;
    }

    // count features
    // if (
    //   "dataType" in groupOptions &&
    //   groupOptions.dataType === "point" &&
    //   groupOptions.name === "Count Features"
    // ) {
    //   console.warn("count features");
    //   return;
    // }

    // all other choropleth
    if (
      ("functions" in groupOptions &&
        (groupOptions.functions === "choropleth" ||
          groupOptions.functions[0] === "choropleth")) ||
      ("dataType" in groupOptions &&
        groupOptions.dataType === "point" &&
        groupOptions.name === "Count Features")
    ) {
      const currentLayerUnit =
        this.state[this.props.variableName].layers.CurrentLayer ===
          layer1County ||
        this.state[this.props.variableName].layers.CurrentLayer === layer2County
          ? "county"
          : "tract";

      // build up view parameters
      const fieldViewParams = {};
      // if there's a >length-one array of years, parameterize it
      if ("year" in fieldOptions && fieldOptions.year.length > 1) {
        fieldViewParams.year = fieldOptions.year[fieldOptions.year.length - 1];
      }

      // TODO filterfields/WFS consistency can make this easier
      // filterfields sometimes parameter, sometimes not, even when
      // needs to be parameterized; assume the field's value is the param value
      if ("parameterKey" in groupOptions) {
        if ("parameter" in fieldOptions) {
          fieldViewParams[groupOptions.parameterKey] =
            fieldOptions.parameter[0];
        } else {
          fieldViewParams[groupOptions.parameterKey] = fieldOptions.value;
        }
      }

      const isParameterized =
        ("parameter" in fieldOptions && fieldOptions.parameter.length) ||
        "parameterKey" in groupOptions;

      // TODO doesn't render properly going back to enum units; await something?
      // if the current layer isn't the enum unit layer switch it back
      if (
        this.state[variableName].prevEnumLayer !==
        this.state[variableName].CurrentLayer
      ) {
        this.setState(
          (state, props) => ({
            [variableName]: {
              ...state[variableName],
              layers: {
                CurrentLayer:
                  variableName === "firstVariable"
                    ? this.state.firstVariable.prevEnumLayer
                    : this.state.secondVariable.prevEnumLayer,
                BasemapLayer: BasemapLayer
              }
            }
          }),
          () => this.forceUpdate()
        );
      }

      await this.state.dataManager.updateViz({
        level: currentLayerUnit,
        toLayer: this.state[variableName].prevEnumLayer,
        groupOptions: {
          geoserverLayer: groupOptions.geoserver_layer,
          parameterKey: groupOptions.parameterKey
        },
        fieldOptions: [
          {
            propertyName: isParameterized ? "data_value" : fieldOptions.value,

            // TODO filterfields/WFS consistency can make this easier
            propertyIsViewParam: isParameterized ? true : false,
            viewParams: fieldViewParams,
            label: fieldOptions.label
          }
        ]
      });

      const lastBreaks = this.state.dataManager.lastBreaks; // array for future bivariate support
      const graphData = this.state.dataManager.graphData;

      this.generateStyleForLegend({
        title: fieldOptions.label,
        styleData: lastBreaks
      });

      return;
    } // end choropleth

    // MERIS
    if (
      groupOptions.name === "Landcover Types" &&
      groupOptions.geoserver_layer === "meris_YYYY:landcover.meris_YYYY_mosaic"
    ) {
      console.warn("MERIS");
      const merisLayer =
        variableName === "firstVariable" ? layer1Meris : layer2Meris;

      // update state to use image layer
      if (this.state[variableName].layers.CurrentLayer !== merisLayer) {
        this.setState(
          (state, props) => ({
            [variableName]: {
              ...state[variableName],
              layers: {
                CurrentLayer: merisLayer,
                BasemapLayer: BasemapLayer
              },
              legend: null,
              prevEnumLayer: this.state[variableName].prevEnumLayer
            }
          }),
          () => this.forceUpdate()
        );
      }

      if (fieldOptions.parameter.length === 0) {
        merisLayer.showAllClasses();
      } else {
        merisLayer.showClasses(fieldOptions.parameter);
      }

      return;
    }
  };

  render() {
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        layers: this.state[this.props.variableName].layers,
        legend: this.state[this.props.variableName].legend,
        handleMapChange: this.handleMapChange,
        graphData: this.state.dataManager.graphData
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
