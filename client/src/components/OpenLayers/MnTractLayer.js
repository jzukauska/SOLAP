/**
 * MN tract layer
 */
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { all as allStrategy } from "ol/loadingstrategy";
import tractGeojson from "./tracts_geoid_prec4.json";
import BasicPolygon from "./Style/BasicPolygon";

const layer1Tract = new VectorLayer({
  name: "mn_tract_2010 layer1Tract",
  source: new VectorSource({
    features: new GeoJSON().readFeatures(tractGeojson, {
      featureProjection: "EPSG:3857"
    }),
    attributions: "U.S. Census Bureau"
  }),

  style: BasicPolygon
});

const layer2Tract = new VectorLayer({
  name: "mn_tract_2010 layer2Tract",
  source: new VectorSource({
    features: new GeoJSON().readFeatures(tractGeojson, {
      featureProjection: "EPSG:3857"
    }),
    attributions: "U.S. Census Bureau"
  }),
  style: BasicPolygon
});

export { layer1Tract, layer2Tract };
