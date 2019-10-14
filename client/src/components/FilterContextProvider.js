import React, { Component } from 'react'
import filterFields from '../filterFields'

const FilterContext = React.createContext()

export default class FilterContextProvider extends Component {
  state = {
    filterFields,
    filterValues: {}
  }

  handleInputChange = e => {
    console.log(e.target.name, e.option || e.target.value)
    this.setState({
      filterValues: {
        ...this.state.filterValues,
        [e.target.name]: {
          ...this.state.filterValues[e.target.name],
          value: e.option || e.target.value,
          colors: null
        }
      }
    })
  }

  clearFilter = name => {
    this.setState({
      filterValues: {
        ...this.state.filterValues,
        [name]: null
      }
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
          handleInputChange: this.handleInputChange
        }}
      >
        {children}
      </FilterContext.Provider>
    )
  }
}

export const FilterConsumer = FilterContext.Consumer
