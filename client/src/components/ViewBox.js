import React from "react";

import { Box } from "grommet";

import Navbar from "./Navbar";
import MapView from "./MapView";

const ViewBox = ({ layers, legend }) => {
  return (
    <Box direction="column" fill>
      <Navbar />
      <MapView layers={layers} legend={legend} />
    </Box>
  );
};

export default ViewBox;
