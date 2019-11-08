import React, { Component } from 'react'
import filterFields from '../filterFields.json'

const FilterContext = React.createContext()

export default class FilterContextProvider extends Component {
  state = {
    filterFields,
    filterValues: {}
  }

  handleInputChange = e => {
    console.log(e.target.name, e.option || e.target.value)
    if (this.state.filterValues.hasOwnProperty("Time Period") && this.state.filterValues.hasOwnProperty("Geographic Area") && Object.keys(this.state.filterValues).length < 4) {
      this.setState({
        filterValues: {
          ...this.state.filterValues,
          [e.target.name]: {
            ...this.state.filterValues[e.target.name],
            value: e.option || e.target.value,
            colors: ''
          }
        }

      })
    }
    else if (this.state.filterValues.hasOwnProperty("Time Period") && Object.keys(this.state.filterValues).length < 3) {
      this.setState({
        filterValues: {
          ...this.state.filterValues,
          [e.target.name]: {
            ...this.state.filterValues[e.target.name],
            value: e.option || e.target.value,
            colors: ''
          }
        }

      })
    }
    else if (this.state.filterValues.hasOwnProperty("Geographic Area") && Object.keys(this.state.filterValues).length < 3) {
      this.setState({
        filterValues: {
          ...this.state.filterValues,
          [e.target.name]: {
            ...this.state.filterValues[e.target.name],
            value: e.option || e.target.value,
            colors: ''
          }
        }
      })
    }
    else if (Object.keys(this.state.filterValues).length < 2 || e.target.name === "Time Period" || e.target.name === "Geographic Area") {
      this.setState({
        filterValues: {
          ...this.state.filterValues,
          [e.target.name]: {
            ...this.state.filterValues[e.target.name],
            value: e.option || e.target.value,
            colors: ''
          }
        }

      })
    }
    else {
      console.log("more than 2 objects choosen")
      alert('Please delete a filter before adding another')
    }
    console.log(Object.keys(this.state.filterValues).length)
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
