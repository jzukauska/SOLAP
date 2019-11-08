import React, { Component } from 'react'
import filterFields from '../filterFields.json'

const FilterContext = React.createContext()

export default class FilterContextProvider extends Component {
  state = {
    filterFields,
    filterValues: {}
  }

  handleInputChange = ({ name, value, yearOptions }) => {
    console.log(name, value, yearOptions)
    this.setState({
      filterValues: {
        ...this.state.filterValues,
        [name]: {
          ...this.state.filterValues[name],
          value,
          yearOptions,
          colors: ''
        }
      }
    })
  }

  clearFilter = name => {
    const { [name]: _, ...filterValues } = this.state.filterValues
    this.setState({
      filterValues
    })
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
    })
  }

  render() {
    const { children } = this.props

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
    )
  }
}

export const FilterConsumer = FilterContext.Consumer
