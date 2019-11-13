/**
 * MN tract layer
 */
import { Vector as VectorLayer } from "ol/layer";
import MNTractSource from "./MnTractSource";
import BasicPolygon from "./Style/BasicPolygon";

export default new VectorLayer({
  name: "mn_tract_2010",
  source: MNTractSource,
  style: BasicPolygon
});
