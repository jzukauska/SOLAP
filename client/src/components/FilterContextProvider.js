import React, { Component } from "react";
import filterFields from "../filterFields.json";

import BasemapLayer from "./OpenLayers/BasemapLayer";
import MnTractLayer from "./OpenLayers/MnTractLayer";
import AlcoholLayerHeatmap from "./OpenLayers/AlcoholLayerHeatmap";

const FilterContext = React.createContext();

export default class FilterContextProvider extends Component {
  state = {
    filterFields,
    required: {},
    filterValues: {},
    layers: {
      BasemapLayer: BasemapLayer,
      MnTractLayer: MnTractLayer,
      AlcoholLayerHeatmap: AlcoholLayerHeatmap
    }
  };

  handleInput1Change = ({ name, value, yearOptions }) => {
    if (name === "Time Period" || name === "Geographic Unit") {
      this.setState({
        required: {
          ...this.state.required,
          [name]: {
            ...this.state.required[name],
            value,
            yearOptions
          }
        }
      })
    }

    else {
      Object.values(this.state.filterValues).forEach(val => {
        if (val.variable) {
          if (val.variable === 1) {
            delete this.state.filterValues[val.name]
          }
        }

      })
      this.setState({
        filterValues: {
          ...this.state.filterValues,
          [name]: {
            ...this.state.filterValues[name],
            name,
            value,
            yearOptions,
            variable: 1
          }
        }
      })
      if (name === "totalPopulation") {
        if (value === "total") {
          this.state.layers.MnTractLayer.symbolizeOn({
            prop1Names: ["male", "female"]
          });
        } else {
          this.state.layers.MnTractLayer.symbolizeOn({ prop1Names: [value] });
        }
      }
    }
  };

  handleInput2Change = ({ name, value, yearOptions }) => {
    if (name === "Time Period" || name === "Geographic Unit") {
      this.setState({
        required: {
          ...this.state.required,
          [name]: {
            ...this.state.required[name],
            value,
            yearOptions
          }
        }
      })
    }

    else {
      Object.values(this.state.filterValues).forEach(val => {
        if (val.variable) {
          if (val.variable === 2) {
            delete this.state.filterValues[val.name]
          }
        }

      })
      this.setState({
        filterValues: {
          ...this.state.filterValues,
          [name]: {
            ...this.state.filterValues[name],
            name,
            value,
            yearOptions,
            variable: 2
          }
        }
      })
      if (name === "totalPopulation") {
        if (value === "total") {
          this.state.layers.MnTractLayer.symbolizeOn({
            prop1Names: ["male", "female"]
          });
        } else {
          this.state.layers.MnTractLayer.symbolizeOn({ prop1Names: [value] });
        }
      }
    }
  };

  clearFilter = name => {
    const { [name]: _, ...filterValues } = this.state.filterValues;
    this.setState({
      filterValues
    });
  };

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
      React.cloneElement(child, { layers: this.state.layers })
    );

    return (
      <FilterContext.Provider
        value={{
          filterFields: this.state.filterFields,
          required: this.state.required,
          filterValues: this.state.filterValues,
          handleInput1Change: this.handleInput1Change,
          handleInput2Change: this.handleInput2Change,
          clearFilter: this.clearFilter
        }}
      >
        {children}
      </FilterContext.Provider>
    );
  }
}

export const FilterConsumer = FilterContext.Consumer;
