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
            top: "0.5em",
            right: "0.5em",
            padding: "0.5em 1em",
            maxWidth: "250px",
            maxHeight: "80vh",
            backgroundColor: "#ffffff",
            border: "medium solid #dddbe0",
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
              margin: "0",
              padding: "0",
              listStyle: "none",
              fontSize: legend.data.length > 8 ? "0.8em" : "1em",
              listStylePosition: "inside",
              maxHeight: "calc(80vh - 3em)",
              overflow: "auto"
            }}
          >
            {legend.data.map(d => {
              return (
                <li
                  style={{
                    display: "block",
                    listStyle: "none",
                    margin: "0.5em 0",
                    padding: "0"
                  }}
                >
                  <span
                    style={{
                      verticalAlign: "middle",
                      display: "inline-block",
                      marginRight: "0.5em",
                      border: "thin solid rgba(0, 0, 0, 0.2)",
                      backgroundColor: d.stroke,
                      width: "2.4em",
                      height: "1.5em"
                    }}
                  ></span>
                  {d.text}
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
