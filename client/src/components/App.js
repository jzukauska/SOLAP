import React from "react";

import FilterContextProvider from "./FilterContextProvider";

import VizController from "./VizController";

import { Grommet } from "grommet";

import ViewBox from "./ViewBox";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const theme = {
  global: {
    colors: {
      brand: "#0CA7D3",
      grey: "#DDDBE0",
      grey2: "#9A9A9A",
      focus: "#0CA7D3"
    },
    font: {
      family: "Open Sans",
      size: "14px",
      height: "20px"
    }
  },
  heading: {
    font: {
      family: "Archivo"
    }
  },
  formField: {
    label: {
      size: "small"
    },
    help: {
      size: "xsmall"
    }
  },
  checkBox: {
    border: {
      color: "grey"
    },
    check: {
      extend: ({ checked }) => `
        ${checked && `background-color: #0CA7D3;`}
        `
    },
    icon: {
      extend: "stroke: white;"
    },
    hover: {
      border: {
        color: "brand"
      }
    }
  }
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#0CA7D3"
  }
}));

const App = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="variable tabs"
        style={{ backgroundColor: "#0ca7d3" }}
      >
        <Tab label="Variable 1" {...a11yProps(0)} />
        <Tab label="Variable 2" {...a11yProps(1)} />
      </Tabs>
      <>
        {value === 0 && (
          <div>
            <Grommet theme={theme} full>
              <VizController variableName={"firstVariable"}>
                <FilterContextProvider variableName={"firstVariable"}>
                  <ViewBox />
                </FilterContextProvider>
              </VizController>
            </Grommet>
          </div>
        )}
      </>
      <>
        {value === 1 && (
          <div>
            <Grommet theme={theme} full>
              <VizController variableName={"secondVariable"}>
                <FilterContextProvider variableName={"secondVariable"}>
                  <ViewBox />
                </FilterContextProvider>
              </VizController>
            </Grommet>
          </div>
        )}
      </>
    </div>
  );
};

export default App;
