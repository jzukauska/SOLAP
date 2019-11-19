import React from 'react'
import { FilterConsumer } from './FilterContextProvider'

import { Box } from 'grommet'

import FilterTable from './FilterTable'
import FilterAccordion from './FilterAccordion'
import styled from 'styled-components'

const MapFilterContainer = styled.div`
  height: 100%;
  overflow: auto;
`

const MapFilter = ({ width }) => {
  return (
    <FilterConsumer>
      {({
        filterFields,
        filterValues,
        handleInputChange,
        handleColorChange,
        clearFilter
      }) => (
          <MapFilterContainer>
            <FilterAccordion
              filterFields={filterFields}
              filterValues={filterValues}
              handleInputChange={handleInputChange}
            />
            
            <FilterTable
              filterValues={filterValues}
              handleColorChange={handleColorChange}
              clearFilter={clearFilter}
            />

            <Box
              background="light"
              pad="large"
              justify="center"
              align="center"
              direction="row"
            >
            </Box>
          </MapFilterContainer>
        )}
    </FilterConsumer>
  )
}

export default MapFilter
