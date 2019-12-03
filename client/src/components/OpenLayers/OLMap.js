import Map from "ol/Map";
import "ol/ol.css";

export default (element, view, layers) =>
  new Map({ view, layers, target: element });
