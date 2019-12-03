/**
 * MN tract layers; distinct sources and objects to avoid https://openlayers.org/en/v6.1.1/doc/errors/#58
 */
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { all as allStrategy } from "ol/loadingstrategy";
import BasicPolygon from "./Style/BasicPolygon";

const serviceUrl =
  "http://149.165.157.200:8080/geoserver/ows?service=wfs&" +
  "version=1.1.0&request=GetFeature&typename=solap:mn_tract_2010&" +
  "outputFormat=application/json&srsname=EPSG:3857";

const layerVar1Tract = new VectorLayer({
  name: "layerVar1Tract",
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

const layerVar2Tract = new VectorLayer({
  name: "layerVar2Tract",
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

const layerBivarTract = new VectorLayer({
  name: "layerBivarTract",
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

export { layerVar1Tract, layerVar2Tract, layerBivarTract };
