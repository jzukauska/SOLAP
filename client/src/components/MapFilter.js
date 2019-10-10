import React, { useState } from 'react'

import { Box } from 'grommet'
import { Button } from 'grommet'

import FilterTable from './FilterTable'
import FilterAccordion from './FilterAccordion'
import styled from 'styled-components'

const MapFilterContainer = styled.div`
  height: 100%;
  overflow: auto;
`

const MapFilter = ({ filterContext }) => {
  const [tblData, setTblData] = useState([
    { id: 1, val: 'ex' },
    { id: 2, val: 'ex2' }
  ])

  const { filterFields, filterValues, handleInputChange } = filterContext

  // const addTableData = data => {
  //   data.id = tblData.length + 1
  //   setTblData([...tblData, data])
  // }

  const deleteData = id => {
    setTblData(tblData.filter(data => data.id !== id))
  }

  return (
    <MapFilterContainer>
      <FilterTable
        tblData={tblData}
        deleteData={deleteData}
        filterValues={filterValues}
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
  )
}

export default MapFilter
