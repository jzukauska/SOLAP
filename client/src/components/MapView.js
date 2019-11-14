import React from "react";
import useWindowSize from "../helpers/useWindowSize";

import DraggableGrid from "./DraggableGrid";
import MapFilter from "./MapFilter";
import MapController from "./MapController";

import View from "./OpenLayers/DefaultView";

//const filterWidth = '900'

const MapView = ({layers}) => {
  const [width] = useWindowSize();
  return (
    <DraggableGrid>
      <MapFilter width={width / 2} />
      <MapController
        view={View}
        layers={layers}
        width={`${width / 2}`}
      />
    </DraggableGrid>
  );
};

export default MapView;
