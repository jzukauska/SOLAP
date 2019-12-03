import React, { useState, useRef, useEffect } from "react";

import OLMap from "./OpenLayers/OLMap";
import BasemapLayer from "./OpenLayers/BasemapLayer";
import MnTractLayer from "./OpenLayers/MnTractLayer";

const MapController = ({ view, layers, legend }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const mapRef = useRef();
  const didMountRef = useRef(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    async function loadMap() {
      if (didMountRef && didMountRef.current) {
        mapInstance
          .getLayers()
          .forEach(async layer => await mapInstance.removeLayer(layer));
        mapInstance
          .getLayers()
          .forEach(async layer => await mapInstance.removeLayer(layer));

        Object.values(layers).map(async layer => {
          await mapInstance.addLayer(layer);
        });

        setCounter(1);
      } else {
        didMountRef.current = true;
        setMapInstance(OLMap(mapRef.current, view, Object.values(layers)));
      }
    }
    loadMap();
  }, [view, layers]);
  // data-nodrag is used to disable dragging on the grid
  return (
    <>
      <div ref={mapRef} data-nodrag="true" style={{ height: "100%" }} />
      {legend && (
        <div
          style={{
            marginBottom: "10px",
            marginLeft: "10px",
            width: "200px",
            height: "400px",
            backgroundColor: "white",
            position: "fixed",
            bottom: 0
          }}
        >
          {legend.title}
          {legend.data.map(d => {
            return (
              <div>
                <div style={{ display: "inline-block" }}>
                  {d.lowerBound} - {d.upperBound}
                </div>
                <div
                  style={{
                    height: "20px",
                    width: "20px",
                    marginTop: "20px",
                    marginLeft: "4px",
                    border: "1px solid black",
                    backgroundColor: d.stroke,
                    display: "inline-block"
                  }}
                ></div>
                <br />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MapController;
