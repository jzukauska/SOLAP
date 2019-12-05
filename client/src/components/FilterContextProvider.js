import React, { Component } from "react";
import { commonFields, scopedFilterFields } from "../filterFields";

const FilterContext = React.createContext();

export default class FilterContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstVariable: { scopedFilterFields, filterValues: {} },
      secondVariable: { scopedFilterFields, filterValues: {} },
      commonFilterValues: {}
    };
  }

  handleInputChange = async ({
    name,
    value,
    yearOptions,
    groupOptions,
    fieldOptions
  }) => {
    const { variableName } = this.props;

    if (name === "Time Period" || name === "Geographic Unit") {
      await this.setState({
        commonFilterValues: {
          ...this.state.commonFilterValues,
          [name]: {
            ...this.state[variableName].filterValues[name],
            name,
            value,
            yearOptions,
            colors: ""
          }
        }
      });
    }
    await this.setState({
      [variableName]: {
        ...this.state[variableName],
        filterValues: {
          [name]: {
            ...this.state[variableName].filterValues[name],
            name,
            value,
            yearOptions,
            colors: ""
          }
        }
      }
    });
    this.props.handleMapChange({
      name,
      value,
      yearOptions,
      groupOptions,
      fieldOptions
    });
  };

  clearFilter = name => {
    const { variableName } = this.props;
    const { [name]: _, ...filterValues } = this.state[
      this.props.variableName
    ].filterValues;

    this.setState({
      [variableName]: {
        ...this.state[variableName],
        filterValues
      }
    });
  };

  handleColorChange = (name, colorsArr) => {
    const { variableName } = this.props;
    this.setState({
      [variableName]: {
        ...this.state[variableName],
        filterValues: {
          ...this.state[this.props.variableName].filterValues,
          [name]: {
            ...this.state[variableName].filterValues[name],
            colors: colorsArr
          }
        }
      }
    });
  };

  render() {
    // add layers to the children
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        layers: this.props.layers,
        legend: this.props.legend
      })
    );

    return (
      <FilterContext.Provider
        value={{
          filterFields: [
            ...commonFields,
            ...this.state[this.props.variableName].scopedFilterFields
          ],
          filterValues: this.state[this.props.variableName].filterValues,
          handleInputChange: this.handleInputChange,
          handleColorChange: this.handleColorChange,
          clearFilter: this.clearFilter,
          tab: this.props.tab
        }}
      >
        {children}
      </FilterContext.Provider>
    );
  }
}

export const FilterConsumer = FilterContext.Consumer;
