/**
 * MN county layer
 */
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { all as allStrategy } from "ol/loadingstrategy";
import BasicPolygon from "./Style/BasicPolygon";

export default new VectorLayer({
  name: "mn_county_2010",
  source: new VectorSource({
    format: new GeoJSON(),
    url: function(extent) {
      return (
        "http://149.165.157.200:8080/geoserver/ows?service=wfs&" +
        "version=1.1.0&request=GetFeature&typename=solap:mn_county_2010&" +
        "outputFormat=application/json&srsname=EPSG:3857"
      );
    },
    attributions: "U.S. Census Bureau",
    strategy: allStrategy
  }),
  style: BasicPolygon
});
