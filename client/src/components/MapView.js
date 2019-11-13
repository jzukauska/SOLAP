import React from "react";
import useWindowSize from "../helpers/useWindowSize";

import DraggableGrid from "./DraggableGrid";
import MapFilter from "./MapFilter";
import MapController from "./MapController";

import View from "./OpenLayers/DefaultView";
import BasemapLayer from "./OpenLayers/BasemapLayer";
import MnCountyLayer from "./OpenLayers/MnCountyLayer";
import AlcoholLayerHeatmap from "./OpenLayers/AlcoholLayerHeatmap";
import MerisLandCover from "./OpenLayers/MerisLandCover";

//const filterWidth = '900'

const MapView = () => {
  const [width] = useWindowSize();
  return (
    <DraggableGrid>
      <MapFilter width={width / 2} />
      <MapController
        view={View}
        layers={[
          BasemapLayer,
          MnCountyLayer,
          AlcoholLayerHeatmap,
          MerisLandCover
        ]}
        width={`${width / 2}`}
      />
    </DraggableGrid>
  );
};

let app = {};
window.app = app;
app.l = MerisLandCover;

export default MapView;
