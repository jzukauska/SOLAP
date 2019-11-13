/**
 * MN county layer
 */
import { Vector as VectorLayer } from "ol/layer";
import MnCountySource from "./MnCountySource";
import BasicPolygon from "./Style/BasicPolygon";

export default new VectorLayer({
  name: "mn_county_2010",
  source: MnCountySource,
  style: BasicPolygon
});
