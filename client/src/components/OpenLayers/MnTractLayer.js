/**
 * MN tract layer
 */
import { Vector as VectorLayer } from "ol/layer";
import { GeoJSON } from "ol/format";
import MnTractSource from "./MnTractSource";
import BasicPolygon from "./Style/BasicPolygon";
import { Vector as VectorSource } from "ol/source";
import { all as allStrategy } from "ol/loadingstrategy";

const serviceUrl =
  "http://149.165.157.200:8080/geoserver/ows?service=wfs&" +
  "version=1.1.0&request=GetFeature&typename=solap:mn_tract_2010&" +
  "outputFormat=application/json&srsname=EPSG:3857";

const layer = new VectorLayer({
  name: "mn_tract_2010",
  source: new VectorSource({
    format: new GeoJSON(),
    url: function(extent) {
      return serviceUrl;
    },
    attributions: "U.S. Census Bureau",
    strategy: allStrategy
  }),
  style: BasicPolygon
});

export default layer;
