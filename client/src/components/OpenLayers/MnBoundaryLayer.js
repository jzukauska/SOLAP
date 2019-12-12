/**
 * MN boundary layer
 */
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { mnBoundary } from "../../constants/mnBoundary";
import { Stroke, Style } from "ol/style";

export default new VectorLayer({
  name: "mn_boundary",
  source: new VectorSource({
    features: new GeoJSON().readFeatures(mnBoundary, {
      featureProjection: "EPSG:3857"
    })
  }),
  style: new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.5)",
      width: 1
    })
  })
});
