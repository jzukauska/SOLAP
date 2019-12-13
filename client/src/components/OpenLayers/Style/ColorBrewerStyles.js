import colorbrewer from "colorbrewer";
import { Stroke, Fill, Style } from "ol/style";
import { asArray as colorAsArray, asString as colorAsString } from "ol/color";

const ColorBrewerStyles = {};
for (const rampId in colorbrewer) {
  if (rampId === "schemeGroups") {
    continue;
  }

  ColorBrewerStyles[rampId] = {};

  for (const rampSize in colorbrewer[rampId]) {
    ColorBrewerStyles[rampId][rampSize] = [];
    for (let i = 0; i < colorbrewer[rampId][rampSize].length; i++) {
      ColorBrewerStyles[rampId][rampSize].push(
        new Style({
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.2)",
            width: 2
          }),
          fill: new Fill({
            color: colorAsString(
              colorAsArray(colorbrewer[rampId][rampSize][i])
                .slice(0, 3)
                .concat(0.7) // adjust opacity
            ) // colarAsString gets rgba for legend
          })
        })
      );
    }
  }
}

// TODO hack to handle too-few enum units and classes, i.e. traffic stops counties
ColorBrewerStyles["YlGnBu"][2] = ColorBrewerStyles["YlGnBu"][3].slice(0, 2);

export default ColorBrewerStyles;
