import React, { Component } from 'react'
import filterFields from '../filterFields.json'

const FilterContext = React.createContext()

export default class FilterContextProvider extends Component {
  state = {
    filterFields,
    filterValues: {}
  }

  handleInputChange = ({ name, value, yearOptions }) => {
    const canAddFilter = () => {
      if (
        this.state.filterValues.hasOwnProperty('Time Period') &&
        this.state.filterValues.hasOwnProperty('Geographic Area') &&
        Object.keys(this.state.filterValues).length < 4
      )
        return (true)
      else if (this.state.filterValues.hasOwnProperty('Time Period') &&
        Object.keys(this.state.filterValues).length < 3
      )
        return (true)
      else if (this.state.filterValues.hasOwnProperty('Geographic Area') &&
        Object.keys(this.state.filterValues).length < 3)
        return (true)
      else if (Object.keys(this.state.filterValues).length < 2 ||
        name === 'Time Period' ||
        name === 'Geographic Area')
        return (true)
      else if (this.state.filterValues.hasOwnProperty(name))
        return (true)
      else
        return (false)

    }
    const canAdd = canAddFilter()
    if (canAdd === true) {
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
    else {
      console.log('more than 2 objects choosen')
      alert('Please delete a filter before adding another')

    }
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
