/**
 * MN county layer
 */
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import BasicPolygon from "./Style/BasicPolygon";
import countyGeojson from "./counties_geoid_prec4.json";

const layer1County = new VectorLayer({
  name: "mn_county_2010 layer1County",
  source: new VectorSource({
    features: new GeoJSON().readFeatures(countyGeojson, {
      featureProjection: "EPSG:3857"
    }),
    attributions: "U.S. Census Bureau"
  }),
  style: BasicPolygon
});

const layer2County = new VectorLayer({
  name: "mn_county_2010 layer2County",
  source: new VectorSource({
    features: new GeoJSON().readFeatures(countyGeojson, {
      featureProjection: "EPSG:3857"
    }),
    attributions: "U.S. Census Bureau"
  }),
  style: BasicPolygon
});

export { layer1County, layer2County };
