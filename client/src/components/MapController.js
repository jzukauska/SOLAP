import React, { useState, useRef, useEffect } from "react";

import OLMap from "./OpenLayers/OLMap";

const MapController = ({ view, layers, legend }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    // BUG: Somehow this creates a new map on viewport width change
    const redrawMap = () => {
      mapInstance.updateSize();
    };
    window.addEventListener("resize", redrawMap);

    return () => {
      window.removeEventListener("resize", redrawMap);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setMapInstance(OLMap(mapRef.current, view, Object.values(layers)));
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
                    border: "1px solid rgba(0, 0, 0, 0.2)",
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
