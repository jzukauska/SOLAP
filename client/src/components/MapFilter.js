import React from "react";
import { FilterConsumer } from "./FilterContextProvider";
import { commonFields, scopedFilterFields } from "../filterFields";
import { Box } from "grommet";

import FilterTable from "./FilterTable";
import FilterAccordion from "./FilterAccordion";
import styled from "styled-components";
import BarGraph from "./BarGraph";
import Settings from "./Settings";

const MapFilterContainer = styled.div`
  height: 40%;
  overflow: auto;
`;

const GraphContainer = styled.div`
  height: 20%;
  overflow: auto;
`;

const SettingsContainer = styled.div`
  height: 3%;
  overflow: auto;
  text-align: right;
`;

const TitleContainer = styled.div`
  height: 3%;
  overflow: auto;
  text-align: center;
`;

const MapFilterGraphContainer = styled.div`
  height: 100%;
  overflow-y: hidden; // hide vertical
`;

const FilterContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const ControlPanelContainer = styled.div`
  height: 30%;
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
          <ControlPanelContainer>
            <FilterAccordion
              filterFields={commonFields}
              filterValues={filterValues}
              handleInputChange={handleInputChange}
              tab={tab}
            />
          </ControlPanelContainer>
          <MapFilterContainer>
            <FilterContainer>
              <FilterAccordion
                filterFields={scopedFilterFields}
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
            </FilterContainer>
          </MapFilterContainer>
          <TitleContainer>
            {graphData.xLabel}
          </TitleContainer>
          <GraphContainer>
            <BarGraph graphData={graphData} />
          </GraphContainer>
        </MapFilterGraphContainer>
      )}
    </FilterConsumer>
  );
};

export default MapFilter;
