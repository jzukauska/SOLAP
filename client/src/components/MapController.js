import React, { useState, useRef, useEffect } from "react";

import OLMap from "./OpenLayers/OLMap";

const MapController = ({ view, layers, legend }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const mapRef = useRef();
  const didMountRef = useRef(false);

  useEffect(() => {
    async function loadMap() {
      if (didMountRef && didMountRef.current) {
        mapInstance.getLayers().clear();

        // need to add the basemap layer at the bottom/front of collection
        Object.values(layers).map(async layer => {
          if (layer.get("name") === "tiledBasemap") {
            await mapInstance.getLayers().insertAt(0, layer);
          } else {
            await mapInstance.addLayer(layer);
          }
        });
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
            bottom: "0.5em",
            left: "0.5em",
            padding: "0.5em 1em",
            maxWidth: "250px",
            backgroundColor: "#ffffff",
            border: "thin solid rgba(0, 0, 0, 0.2)",
            position: "fixed"
          }}
        >
          <p
            style={{
              margin: "0",
              fontWeight: "bold"
            }}
          >
            {legend.title.charAt(0).toUpperCase() + legend.title.slice(1)}
          </p>
          <ul
            style={{
              float: "left",
              margin: "0",
              padding: "0",
              listStyle: "none",
              listStylePosition: "inside"
            }}
          >
            {legend.data.map(d => {
              return (
                <li
                  style={{
                    lineHeight: "1.5em",
                    listStyle: "none",
                    margin: "0.5em 0",
                    padding: "0"
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      float: "left",
                      marginRight: "0.5em",
                      border: "thin solid rgba(0, 0, 0, 0.2)",
                      backgroundColor: d.stroke,
                      width: "2.4em",
                      height: "1.5em"
                    }}
                  ></span>
                  {d.lowerBound.toLocaleString()}&nbsp;&ndash;&nbsp;
                  {d.upperBound.toLocaleString()}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default MapController;
