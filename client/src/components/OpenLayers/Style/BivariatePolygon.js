/**
 * build a biviarate set of styles from the third of four options at
 * https://www.joshuastevens.net/cartography/make-a-bivariate-choropleth-map/
 * first level is rows bottom to top (low to high), second columns left-to-right (low to high)
 */
import { Stroke, Fill, Style } from "ol/style";

const bivariateColors = [
  ["#e8e8e8", "#b5c0da", "#6c83b5"], // low row
  ["#b8dfbe", "#90b2b3", "#567994"], // medium row
  ["#73ae80", "#5a9178", "#2a5a5b"] // high row
];

const bivariateStyles = {};
for (let r = 0; r < bivariateColors.length; r++) {
  bivariateStyles[r] = {};
  for (let c = 0; c < bivariateColors[r].length; c++) {
    bivariateStyles[r][c] = new Style({
      stroke: new Stroke({
        color: "#000",
        width: 1
      }),
      fill: new Fill({
        color: bivariateColors[r][c]
      })
    });
  }
}

export default bivariateStyles;
