import React, { Component } from 'react'

const filterData = {
  boundary: {
    name: 'Boundary',
    options: [
      {
        name: 'Year',
        min: 2000,
        max: 2010,
        step: 1,
        type: 'RangeInput',
        value: 0
      },
      {
        name: 'Area',
        type: 'Select',
        value: null
      }
    ]
  },
  population: {
    name: 'population',
    options: [
      {
        name: 'demographic',
        options: [
          {
            name: 'populationBySex',
            type: 'radio',
            value: null
          },
          {
            name: 'populationByAge',
            type: 'radio',
            value: null
          }
        ]
      }
    ]
  }
}

const FilterContext = React.createContext()

export default class FilterContextProvider extends Component {
  state = filterData

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
          filterData: this.state,
          changeYear: this.changeYear
        }}
      >
        {children}
      </FilterContext.Provider>
    )
  }
}

export const FilterConsumer = FilterContext.Consumer
