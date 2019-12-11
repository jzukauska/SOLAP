import React from "react";
import { FilterConsumer } from "./FilterContextProvider";

import { Box } from "grommet";

import FilterTable from "./FilterTable";
import FilterAccordion from "./FilterAccordion";
import styled from "styled-components";
import BarGraph from "./BarGraph";

const MapFilterContainer = styled.div`
  height: 75%;
  overflow: auto;
`;

const MapGraphContainer = styled.div`
  height: 25%;
  overflow: auto;
`;

const MapFilterGraphContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const MapFilter = ({ width, graphData }) => {
  return (
    <FilterConsumer>
      {({
        filterFields,
        filterValues,
        handleInputChange,
        handleColorChange,
        clearFilter,
        tab
      }) => (
        <MapFilterGraphContainer>
          <MapFilterContainer>
            <FilterAccordion
              filterFields={filterFields}
              filterValues={filterValues}
              handleInputChange={handleInputChange}
              tab={tab}
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
            ></Box>
          </MapFilterContainer>
          <MapGraphContainer>
            <BarGraph graphData={graphData}/>
          </MapGraphContainer>
        </MapFilterGraphContainer>
      )}
    </FilterConsumer>
  );
};

export default MapFilter;
