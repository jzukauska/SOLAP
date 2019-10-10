import React, { Component } from 'react'
import filterFields from '../filterFields'

const FilterContext = React.createContext()

export default class FilterContextProvider extends Component {
  state = {
    filterFields,
    filterValues: {
      year: 0,
      area: ''
    }
  }

  handleInputChange = e => {
    console.log(e.target.name, e.option || e.target.value)
    this.setState({
      filterValues: {
        ...this.state.filterValues,
        [e.target.name]: e.option || e.target.value
      }
    })
  }

  changeYear = year => {
    console.log(year)
    const newState = { ...this.state }
    newState.boundary.options[0].value = year
    this.setState(newState)
  }

  changeBoundaryArea = name => {
    const newState = { ...this.state }
    newState.boundary.options[1].value = name
  }

  render() {
    const { children } = this.props

    return (
      <FilterContext.Provider
        value={{
          filterFields: this.state.filterFields,
          filterValues: this.state.filterValues,
          handleInputChange: this.handleInputChange,
          changeYear: this.changeYear
        }}
      >
        {children}
      </FilterContext.Provider>
    )
  }
}

export const FilterConsumer = FilterContext.Consumer
