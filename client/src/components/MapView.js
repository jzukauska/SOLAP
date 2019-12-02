import React from "react";
import useWindowSize from "../helpers/useWindowSize";

import DraggableGrid from "./DraggableGrid";
import MapFilter from "./MapFilter";
import OLMap from "./OpenLayers/OLMap";

const MapView = ({ layers, legend }) => {
  const [width] = useWindowSize();
  return (
    <DraggableGrid>
      <MapFilter width={width / 3} />
      <OLMap width={`${(2 * width) / 3}`} />
    </DraggableGrid>
  );
};

export default MapView;
