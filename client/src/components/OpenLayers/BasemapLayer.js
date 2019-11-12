/**
 * CARTO Voyager basemap
 */
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source";

export default new TileLayer({
  source: new XYZ({
    url:
      "https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attributions:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution/">CartoDB</a>'
  })
});
