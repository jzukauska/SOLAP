import React from "react";
import { useState } from "react";
import { FilterConsumer } from "./FilterContextProvider";
import { Box } from "grommet";
import logo from "./che_black_long.svg";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";

const Navbar = ({ tab }) => {
  const [variable, setVariable] = useState("Nothing");
  const [year, setYear] = useState("2010");
  const [area, setArea] = useState("Minnesota");
  const [NavbarContainer] = useState(
    styled(Box)`
      height: 50px;
      width: 100%;
    `
  );

  return (
    <NavbarContainer
      pad="small"
      background={parseInt(tab.currentTab) === 1 ? "#FFE7C7" : "#ACDDDE"}
    >
      <Grid container justify="space_evenly" alignContent="center">
        <Grid item xs={6}>
          <div>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "400px", height: "40px", verticalAlign: "top" }}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          Mapping: {variable} for {year} for {area}
        </Grid>
      </Grid>

      <FilterConsumer>
        {({
          filterFields,
          filterValues,
          prefLabel,
          handleInputChange,
          handleColorChange,
          clearFilter
        }) => {
          Object.entries(filterValues).map(([name, obj]) => {
            if (obj !== null && name === "Geographic Unit") {
              setArea(obj.value);
            } else if (obj !== null && name === "Time Period") {
              setYear(obj.value);
            } else if (obj !== null && name) {
              setVariable(obj.value);
            }
          });
          if (prefLabel) {
            setVariable(prefLabel);
          }
        }}
      </FilterConsumer>
    </NavbarContainer>
  );
};

export default Navbar;
