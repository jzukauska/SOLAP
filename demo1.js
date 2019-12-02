import "ol/ol.css";
import { Map, View } from "ol";
import { defaults as defaultControls, Attribution } from "ol/control";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { GeoJSON } from "ol/format";
import { all as allStrategy } from "ol/loadingstrategy";
import { Vector as VectorSource, XYZ } from "ol/source";
import { Stroke, Fill, Style } from "ol/style";

// A CARTO basemap
const basemapLayer = new TileLayer({
  source: new XYZ({
    url:
      "https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attributions:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution/">CartoDB</a>'
  })
});

const countySource = new VectorSource({
  format: new GeoJSON(),
  url: function(extent) {
    return (
      "http://149.165.157.200:8080/geoserver/ows?service=wfs&" +
      "version=1.1.0&request=GetFeature&typename=solap:mn_county_2010&" +
      "outputFormat=application/json&srsname=EPSG:3857"
    );
  },
  attributions: "U.S. Census Bureau",
  strategy: allStrategy //it's not that much, just grab it all
});

const tractSource = new VectorSource({
  format: new GeoJSON(),
  url: function(extent) {
    return (
      "http://149.165.157.200:8080/geoserver/ows?service=wfs&" +
      "version=1.1.0&request=GetFeature&typename=solap:mn_tract_2010&" +
      "outputFormat=application/json&srsname=EPSG:3857"
    );
  },
  attributions: "U.S. Census Bureau",
  strategy: allStrategy // not terrible if simplified; take it all
});

/**
 * Basic style. The transparent fill is used to catch clicks on features
 * (not in this demo). Without a fill, clicks will only register on
 * feature boundaries/strokes.
 */
const styleBasicPolygon = new Style({
  stroke: new Stroke({
    color: "rgba(0, 0, 0, 1.0)",
    width: 1
  }),
  fill: new Fill({
    color: "transparent"
  })
});

// Vector layers for use in the map
const countyLayer = new VectorLayer({
  source: countySource,
  style: styleBasicPolygon
});

const tractLayer = new VectorLayer({
  source: tractSource,
  style: styleBasicPolygon
});

// Setup the attribution on layers
const attribution = new Attribution({
  collapsible: false
});

const map = new Map({
  target: "map",
  layers: [basemapLayer, countyLayer],
  view: new View({
    center: [-10440000, 5693000],
    zoom: 6
  }),
  controls: defaultControls({ attribution: false }).extend([attribution])
});

// attribution: collapse if needed
const checkSize = function() {
  var small = map.getSize()[0] < 600;
  attribution.setCollapsible(small);
  attribution.setCollapsed(small);
};
window.addEventListener("resize", checkSize);
checkSize();

// Allow swapping of coutny and tract vector layers
document
  .querySelector("#countyTractSelector")
  .addEventListener("change", function(e) {
    if (e.target.value === "county") {
      map.removeLayer(tractLayer);
      map.addLayer(countyLayer);
    }

    if (e.target.value === "tract") {
      map.removeLayer(countyLayer);
      map.addLayer(tractLayer);
    }
  });
