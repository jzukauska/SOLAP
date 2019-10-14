import React, { useState } from 'react'
import { FilterConsumer } from './FilterContextProvider'

import { Box } from 'grommet'
import { Button } from 'grommet'

import FilterTable from './FilterTable'
import FilterAccordion from './FilterAccordion'
import styled from 'styled-components'

const MapFilterContainer = styled.div`
  height: 100%;
  overflow: auto;
`

const MapFilter = ({ width }) => {
  const [tblData, setTblData] = useState([
    { id: 1, val: 'ex' },
    { id: 2, val: 'ex2' }
  ])

  // const addTableData = data => {
  //   data.id = tblData.length + 1
  //   setTblData([...tblData, data])
  // }

  const deleteData = id => {
    setTblData(tblData.filter(data => data.id !== id))
  }

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
          <FilterTable
            tblData={tblData}
            deleteData={deleteData}
            filterValues={filterValues}
            handleColorChange={handleColorChange}
            clearFilter={clearFilter}
          />

          <FilterAccordion
            filterFields={filterFields}
            filterValues={filterValues}
            handleInputChange={handleInputChange}
          />

          <Box
            background="light"
            pad="large"
            justify="center"
            align="center"
            direction="row"
          >
            <Button label="Update Map" onClick={() => this.setState({})} />
          </Box>
        </MapFilterContainer>
      )}
    </FilterConsumer>
  )
}

export default MapFilter
