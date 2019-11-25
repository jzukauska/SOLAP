import React from "react";
import { FilterConsumer } from "./FilterContextProvider";

import { Box, Tab, Tabs } from 'grommet'

import FilterTable from "./FilterTable";
import FilterAccordion from "./FilterAccordion";
import styled from "styled-components";

const MapFilterContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const MapFilter = ({ width }) => {
  return (
    <FilterConsumer>
      {({
        required,
        filterFields,
        filterValues,
        handleInput1Change,
        handleInput2Change,
        clearFilter
      }) => (
          <MapFilterContainer>
            <Tabs>
              <Tab title={"Variable 1"}>
                <FilterAccordion
                  required={required}
                  filterFields={filterFields}
                  filterValues={filterValues}
                  handleInputChange={handleInput1Change}
                />
              </Tab>
              <Tab title={"Variable 2"}>
                <FilterAccordion
                  required={required}
                  filterFields={filterFields}
                  filterValues={filterValues}
                  handleInputChange={handleInput2Change}
                />
              </Tab>
            </Tabs>
            <FilterTable
              required={required}
              filterValues={filterValues}
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
        )
      }
    </FilterConsumer >
  )
}

export default MapFilter;
