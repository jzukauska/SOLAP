import React from "react";
import ReactDOM from "react-dom";

import Map from "ol/Map";
import View from "ol/View";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
import MnTractLayer from "./MnTractLayer";
import MnCountyLayer from "./MnCountyLayer";

import "ol/ol.css";

const app = {};
window.app = app;

class OLMap extends React.Component {
  componentDidMount() {
    const BasemapLayer = new TileLayer({
      source: new XYZ({
        url:
          "https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attributions:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution/">CartoDB</a>'
      })
    });

    const layerCounties = MnCountyLayer;
    const layerTracts = MnTractLayer;
    layerTracts.setVisible(false);
    const map = new Map({
      target: this.refs.mapContainer,
      layers: [BasemapLayer, layerCounties, layerTracts],
      view: new View({
        center: fromLonLat([-93.26384, 44.97997]),
        zoom: 6
      })
    });

    // save map and layer references to local state
    this.setState({
      map: map,
      layerCounties: layerCounties,
      layerTracts: layerTracts
    });

    app.olmap = this;
  }

  // for counties/tracts only
  // sample symbolization for counties of tracts, style the map
  // doesn't include WFS/data retrieval, happens in VizController?
  // toggle layer visibility as needed
  symbolizeMapOn(layerChoice, valuesByGeoid, classBreaks, legendTitle) {
    // add/update valuesByGeoid to counties/tracts
    // generate style function
    // set style on layer using function
    // update legend
  }

  // show counties, hide tracts
  showCountyLayer() {
    console.log("this.state :", this.state);
    this.state.layerCounties.setVisible(true);
    this.state.layerTracts.setVisible(false);
  }

  // show tracts, hide counties
  showTractLayer() {
    this.state.layerCounties.setVisible(false);
    this.state.layerTracts.setVisible(true);
  }

  // state changes trigger this
  // any use for this? state changes on the controls
  // should do something with VizController that should
  // then call methods here?
  componentDidUpdate(prevProps, prevState) {
    return;
  }

  render() {
    return <div ref="mapContainer" style={{ height: "100%" }} />;
  }
}

export default OLMap;
