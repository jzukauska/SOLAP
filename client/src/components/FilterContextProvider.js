import React, { Component } from "react";
import filterFields from "../filterFields.json";

import BasemapLayer from "./OpenLayers/BasemapLayer";
import MnTractLayer from "./OpenLayers/MnTractLayer";
import AlcoholLayerHeatmap from "./OpenLayers/AlcoholLayerHeatmap";
import ColorBrewerStyles from "./OpenLayers/Style/ColorBrewerStyles";

const FilterContext = React.createContext();

export default class FilterContextProvider extends Component {
  state = {
    filterFields,
    filterValues: {},
    layers: {
      BasemapLayer: BasemapLayer,
      MnTractLayer: MnTractLayer,
      AlcoholLayerHeatmap: AlcoholLayerHeatmap
    },
    legend: null
  };

  handleInputChange = async ({ name, value, yearOptions }) => {
    const canAddFilter = () => {
      if (
        this.state.filterValues.hasOwnProperty("Time Period") &&
        this.state.filterValues.hasOwnProperty("Geographic Unit") &&
        Object.keys(this.state.filterValues).length < 4
      )
        return true;
      else if (
        this.state.filterValues.hasOwnProperty("Time Period") &&
        Object.keys(this.state.filterValues).length < 3
      )
        return true;
      else if (
        this.state.filterValues.hasOwnProperty("Geographic Unit") &&
        Object.keys(this.state.filterValues).length < 3
      )
        return true;
      else if (
        Object.keys(this.state.filterValues).length < 2 ||
        name === "Time Period" ||
        name === "Geographic Unit"
      )
        return true;
      else if (this.state.filterValues.hasOwnProperty(name)) return true;
      else return false;
    };
    const canAdd = canAddFilter();
    if (canAdd === true) {
      this.setState({
        filterValues: {
          ...this.state.filterValues,
          [name]: {
            ...this.state.filterValues[name],
            value,
            yearOptions,
            colors: ""
          }
        }
      });
      if (name === "totalPopulation") {
        if (value === "total") {
          const styleData = await this.state.layers.MnTractLayer.symbolizeOn({
            prop1Names: ["male", "female"]
          });
          this.generateStyleForLegend({ title: "Total Population", styleData });
        } else {
          const styleData = await this.state.layers.MnTractLayer.symbolizeOn({
            prop1Names: [value]
          });
          this.generateStyleForLegend({ title: `${value}`, styleData });
        }
      }
    } else {
      console.log("more than 2 objects choosen");
      alert("Please delete a filter before adding another");
    }
  };

  clearFilter = name => {
    const { [name]: _, ...filterValues } = this.state.filterValues;
    this.setState({
      filterValues
    });
  };

  generateStyleForLegend({ title, styleData }) {
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
    this.setState({ legend: { title, data: legend } });
  }

  handleColorChange = (name, colorsArr) => {
    this.setState({
      filterValues: {
        ...this.state.filterValues,
        [name]: {
          ...this.state.filterValues[name],
          colors: colorsArr
        }
      }
    });
  };

  render() {
    // add layers to the children
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        layers: this.state.layers,
        legend: this.state.legend
      })
    );

    return (
      <FilterContext.Provider
        value={{
          filterFields: this.state.filterFields,
          filterValues: this.state.filterValues,
          handleInputChange: this.handleInputChange,
          handleColorChange: this.handleColorChange,
          clearFilter: this.clearFilter
        }}
      >
        {children}
      </FilterContext.Provider>
    );
  }
}

export const FilterConsumer = FilterContext.Consumer;
