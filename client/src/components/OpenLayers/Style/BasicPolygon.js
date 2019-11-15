/**
 * Basic polygon. The transparent fill is used to catch clicks on features
 * (not in this demo). Note that without a fill, clicks will only register on
 * feature boundaries/strokes.
 */
import { Stroke, Fill, Style } from "ol/style";

export default new Style({
  stroke: new Stroke({
    color: "rgba(0, 0, 0, 0.2)",
    width: 1
  }),
  fill: new Fill({
    color: "transparent"
  })
});
