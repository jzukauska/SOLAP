import React from "react";
import { useState } from "react";
import { FilterConsumer } from "./FilterContextProvider";
import { Box } from "grommet";

import styled from "styled-components";

const NavbarContainer = styled(Box)`
  height: 50px;
  width: 100%;
  background-color: #0ca7d3;
`;

const Navbar = () => {
  const [year, setYear] = useState("[Year]");
  const [area, setArea] = useState("[Geographic Unit]");
  return (
    <NavbarContainer pad="small">
      <text>
        Mapping: {year} for {area}
      </text>
      <FilterConsumer>
        {({
          filterFields,
          filterValues,
          handleInputChange,
          handleColorChange,
          clearFilter
        }) =>
          Object.entries(filterValues).map(([name, obj]) => {
            if (obj !== null && name === "Geographic Unit") {
              setArea(obj.value);
            } else if (obj !== null && name === "Time Period") {
              setYear(obj.value);
            }
          })
        }
      </FilterConsumer>
    </NavbarContainer>
  );
};

export default Navbar;
