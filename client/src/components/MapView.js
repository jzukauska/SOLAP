import React from "react";
import useWindowSize from "../helpers/useWindowSize";

import DraggableGrid from "./DraggableGrid";
import MapFilter from "./MapFilter";
import MapController from "./MapController";
import BarGraph from "./BarGraph"

import View from "./OpenLayers/DefaultView";

//const filterWidth = '900'

const MapView = ({ layers, legend }) => {
  const [width] = useWindowSize();
  return (
    <DraggableGrid>
      <MapFilter width={width / 3} />
      <BarGraph />
      <MapController
        view={View}
        layers={layers}
        legend={legend}
        width={`${(2 * width) / 3}`}
      />
    </DraggableGrid>
  );
};

export default MapView;
