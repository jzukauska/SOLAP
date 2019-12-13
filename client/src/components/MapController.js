import React, { useState, useRef, useEffect } from "react";
import OLMap from "./OpenLayers/OLMap";
import heatmapLegend from "./heatmap_legend_34x150.png";

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

  // TODO better handling for rectangle swatches vs circle swatches, very undry
  if (legend && legend.heatmap) {
    // heatmap is a static image with low and high
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
            <div style={{ marginTop: "0.5em" }}>
              <img
                src={heatmapLegend}
                alt="heatmap legend: blue is low, red medium, yellow high"
                style={{ float: "left" }}
              />
              <div
                class="legend-marks"
                style={{
                  float: "left",
                  marginLeft: "0.25em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "150px"
                }}
              >
                <span style={{ display: "flex" }}>high concentration</span>
                <span style={{ display: "flex" }}>low concentration</span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else if (legend && legend.pointData) {
    // circular points with fill/stroke
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
                listStylePosition: "inside",
                maxHeight: "calc(80vh - 3em)",
                overflow: "auto"
              }}
            >
              {legend.pointData.map(d => {
                return (
                  <li
                    style={{
                      display: "block",
                      listStyle: "none",
                      margin: "0.5em 0",
                      padding: "0",
                      lineHeight: "1em"
                    }}
                  >
                    <span
                      style={{
                        verticalAlign: "middle",
                        display: "inline-block",
                        marginRight: "0.5em",
                        marginTop: "-1px",
                        backgroundColor: d.fill,
                        borderRadius: "calc(0.5em - 1px)",
                        border: "1px solid " + d.stroke,
                        width: "calc(1em - 2px)",
                        height: "calc(1em - 2px)"
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
  } else {
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
  }
};

export default MapController;
