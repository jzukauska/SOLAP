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
  const [currentVariable, setCurrentVariable] = React.useState("firstVariable");
  const handleChange = (event, newValue) => {
    const newVariable = newValue === 0 ? "firstVariable" : "secondVariable";
    setValue(newValue);
    setCurrentVariable(newVariable);
  };
  return (
    <div className={classes.root}>
      <div>
        <Grommet theme={theme}>
          <VizController variableName={currentVariable}>
            <FilterContextProvider
              variableName={currentVariable}
              tab={{ changeTab: handleChange, currentTab: value }}
            >
              <ViewBox tab={{ currentTab: value }} />
            </FilterContextProvider>
          </VizController>
        </Grommet>
      </div>
    </div>
  );
};

export default App;
