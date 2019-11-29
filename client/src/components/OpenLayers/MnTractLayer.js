/**
 * MN tract layer
 */
import { Vector as VectorLayer } from "ol/layer";
import MnTractSource from "./MnTractSource";
import BasicPolygon from "./Style/BasicPolygon";

const layer = new VectorLayer({
  name: "mn_tract_2010",
  source: MnTractSource,
  style: BasicPolygon
});

export default layer;
