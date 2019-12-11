import ImageWMS from "ol/source/ImageWMS";
import { Image } from "ol/layer";

const layer1Image = new Image({
  source: new ImageWMS({
    url: "http://149.165.157.200:8080/geoserver/wms",
    params: { LAYERS: "solap:alcohol_outlet" },
    ratio: 1,
    serverType: "geoserver"
  })
});

const layer2Image = new Image({
  source: new ImageWMS({
    url: "http://149.165.157.200:8080/geoserver/wms",
    params: { LAYERS: "solap:alcohol_outlet" },
    ratio: 1,
    serverType: "geoserver"
  })
});

export { layer1Image, layer2Image };
