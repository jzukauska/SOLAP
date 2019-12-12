// TODO extend this and MerisLandCover from an intermediate class, all that differ are class options and layer names
// TODO or a single SolapLandCover Image/ImageWMS class?
import ImageWMS from "ol/source/ImageWMS";
import { Image } from "ol/layer";

//https://maps.elie.ucl.ac.be/CCI/viewer/download/CCI-LC_Maps_Legend.pdf
const GlcClasses = {
  lcmxlftree: null,
  lcdecidcl: null,
  lcndldecid: null,
  lcbrdevgrn: null,
  lcndlevgrn: null,
  lcaqtrfrsh: null,
  lcwater: null,
  lcdecidop: null,
  lcaqshrb: null,
  lcsnowice: null,
  lcaqtrsali: null,
  lctreeburn: null,
  lctreeoth: null,
  lcsparse: null,
  lcartif: null,
  lcagtroth: null,
  lcagshrb: null,
  lcshbdecid: null,
  lcmngterr: null,
  lcshbevgrn: null,
  lcherbac: null,
  lcbare: null,
  lcnodata: null
};

class GlcLayer extends Image {
  constructor(opt_options) {
    super(opt_options);
  }
  /**
   * Show all classes, maybe excluding nodata
   *
   * @param {bool} [includeNoData=false] whether to include the nodata class
   */
  showAllClasses = function(includeNoData = false) {
    let keys = Object.keys(GlcClasses),
      newEnvStr = "";

    // Set nodata opacity to zero
    if (!includeNoData) {
      keys.splice(keys.indexOf("lcnodata"), 1);
      newEnvStr = "lcnodata:0;";
    }

    newEnvStr += keys.map(key => `${key}:1`).join(";");
    this.getSource().updateParams({ env: newEnvStr });
  };

  /**
   * Hide all classes
   */
  hideAllClasses = function() {
    let keys = Object.keys(GlcClasses),
      newEnvStr;
    newEnvStr = keys.map(key => `${key}:0`).join(";");
    this.getSource().updateParams({ env: newEnvStr });
  };

  /**
   * Show or hide a set of classes
   *
   * @param {bool} show true to show classes, false to hide
   * @param {string[]} classes array of class names to show/hide
   * @param {bool} reset if true remove other prefs
   */
  updateClasses = function(show, classes, reset = false) {
    if (typeof classes === "undefined") {
      return;
    }

    const currentParams = this.getSource().getParams();
    let currentEnv, currentEnvArray, updateEnv, newEnv, newEnvStr;

    if ("env" in currentParams) {
      currentEnvArray = currentParams.env.split(";");
    } else {
      currentEnvArray = [];
    }

    currentEnv = currentEnvArray.reduce(function(obj, str) {
      let split = str.split(":");
      obj[split[0]] = split[1];
      return obj;
    }, {});

    updateEnv = classes.reduce(function(obj, str, index) {
      obj[str] = show ? 1 : 0;
      return obj;
    }, {});

    newEnv = Object.assign(currentEnv, updateEnv);
    newEnvStr = Object.keys(newEnv)
      .map(key => `${key}:${newEnv[key]}`)
      .join(";");
    this.getSource().updateParams({ env: newEnvStr });
  };

  /**
   * Show a set of classes, hide others
   *
   * @param {string[]} classes array of classes to display
   * @param {number} opacity opacity of classes to display, 0-1
   * @memberof GlcLayer
   */
  showClasses = function(classes, opacity = 1) {
    const classSettings = {};
    let newEnvStr;

    // set all known classes to hidden
    for (let c in GlcClasses) {
      classSettings[c] = 0;
    }

    // override those requested
    for (let c in classes) {
      console.log("c :", c);
      console.log("classes[c] :", classes[c]);
      classSettings[classes[c]] = opacity;
    }

    newEnvStr = Object.keys(classSettings)
      .map(key => `${key}:${classSettings[key]}`)
      .join(";");

    this.getSource().updateParams({ env: newEnvStr });
    // console.log("classSettings :", classSettings);
    // for (let c in classes) {
    //   classSettings
    // }
  };
}

/* Image layer for displaying the source */
const layer1Glc = new GlcLayer({
  source: new ImageWMS({
    url: "http://149.165.157.200:8080/geoserver/wms",
    params: {
      LAYERS: "glc:GLC",
      env: "lcnodata:0"
    },
    ratio: 1,
    serverType: "geoserver"
  })
});

const layer2Glc = new GlcLayer({
  source: new ImageWMS({
    url: "http://149.165.157.200:8080/geoserver/wms",
    params: {
      LAYERS: "glc:GLC",
      env: "lcnodata:0"
    },
    ratio: 1,
    serverType: "geoserver"
  })
});

export { layer1Glc, layer2Glc };
