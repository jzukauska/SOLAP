import "ol/ol.css";
import { Map, View } from "ol";
import { defaults as defaultControls, Attribution } from "ol/control";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import XYZ from "ol/source/XYZ";
import { WFS, GeoJSON } from "ol/format";
import { all as allStrategy, bbox as bboxStrategy } from "ol/loadingstrategy";
import VectorSource from "ol/source/Vector";
import { Stroke, Fill, Style } from "ol/style";
import {
  equalTo as equalToFilter,
  like as likeFilter,
  and as andFilter
} from "ol/format/filter";

window.app = {};
app = window.app;

const basemapLayer = new TileLayer({
  source: new XYZ({
    url:
      "https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attributions:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution/">CartoDB</a>'
  })
});

const attribution = new Attribution({
  collapsible: false
});

const countySource = new VectorSource({
  format: new GeoJSON(),
  url: function(extent) {
    return "http://149.165.157.200:8080/geoserver/ows?service=wfs&version=1.1.0&request=GetFeature&typename=solap:mn_county_2010_1&outputFormat=application/json&srsname=EPSG:3857";
  },
  strategy: allStrategy //it's not that much, just grab it all
});

const tractSource = new VectorSource({
  format: new GeoJSON(),
  url: function(extent) {
    return (
      "http://149.165.157.200:8080/geoserver/ows?service=wfs&" +
      "version=1.1.0&request=GetFeature&typename=solap:mn_tract_2010_1&" +
      "outputFormat=application/json&srsname=EPSG:3857&" +
      "bbox=" +
      extent.join(",") +
      ",EPSG:3857"
    );
  },
  strategy: bboxStrategy
});

const countyLayer = new VectorLayer({
  source: countySource,
  style: new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 1.0)",
      width: 1
    }),
    fill: new Fill({
      color: "transparent"
    })
  })
});

const tractLayer = new VectorLayer({
  source: tractSource,
  style: new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.6)",
      width: 0.5
    }),
    fill: new Fill({
      color: "transparent"
    })
  })
});

const view = new View({
  center: [-10500000, 5860000],
  zoom: 6
});

const map = new Map({
  target: "map",
  layers: [basemapLayer, countyLayer],
  view: view,
  controls: defaultControls({ attribution: false }).extend([attribution])
});

// attribution: collapse if needed
function checkSize() {
  var small = map.getSize()[0] < 600;
  attribution.setCollapsible(small);
  attribution.setCollapsed(small);
}

window.addEventListener("resize", checkSize);
checkSize();

// Take county/tract layer changes
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

// generate a GetFeature request
var featureRequest = new WFS().writeGetFeature({
  srsName: "EPSG:3857",
  featurePrefix: "solap_test",
  featureTypes: ["tl_2010_27_county10_4326"],
  propertyNames: ["GEOID10", "H7V001_sf", "ALAND10", "AWATER10"],
  outputFormat: "application/json"
});

app.fr = featureRequest;

fetch("https://us-geoserver-tst-app-01.oit.umn.edu/geoserver/wfs", {
  method: "POST",
  body: new XMLSerializer().serializeToString(featureRequest)
})
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    var features = new GeoJSON().readFeatures(json);
    app.nf = features;
    app.nfo = {};
    for (let i = 0; i < features.length; i++) {
      app.nfo[features[i].getProperties()["GEOID10"]] = features[i];
    }

    //vectorSource.addFeatures(features);
    //map.getView().fit(vectorSource.getExtent());
  });

app.map = map;
app.cs = countySource;
app.cl = countyLayer;
app.ts = tractSource;
app.tl = tractLayer;
app.GeoJSON = GeoJSON;

// Update properties on county vector source
let curFeats = app.cs.getFeatures();
let curGeoid, addlProps;
for (let i = 0; i < curFeats.length; i++) {
  curGeoid = curFeats[i].getProperties()["geoid"];
  if (curGeoid in app.nfo) {
    addlProps = Object.assign({}, app.nfo[curGeoid].getProperties());
    delete addlProps.geometry;
    delete addlProps.GEOID10;
    curFeats[i].setProperties(addlProps);
  }
}
