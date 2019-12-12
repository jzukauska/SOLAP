import ImageWMS from "ol/source/ImageWMS";
import { Image } from "ol/layer";

//https://maps.elie.ucl.ac.be/CCI/viewer/download/CCI-LC_Maps_Legend.pdf
const MerisLandCoverClasses = {
  lcnodata: {
    desc: "No Data",
    val: 0
  },
  lccroprain: {
    desc: "Cropland, rainfed",
    val: 10
  },
  lcherbac: {
    desc: "Herbaceous cover",
    val: 11
  },
  lctreeshrb: {
    desc: "Tree or shrub cover",
    val: 12
  },
  lccropirripofld: {
    desc: "Cropland, irrigated or post‐flooding",
    val: 20
  },
  lcmocropnatvege: {
    desc:
      "Mosaic cropland (>50%) / natural vegetation (tree, shrub, herbaceous cover) (<50%)",
    val: 30
  },
  lcmonatvegecrop: {
    desc:
      "Mosaic natural vegetation (tree, shrub, herbaceous cover) (>50%) / cropland (<50%)  ",
    val: 40
  },
  lctreebrevgrncto: {
    desc: "Tree cover, broadleaved, evergreen, closed to open (>15%)",
    val: 50
  },
  lctreebrdecicto: {
    desc: "Tree cover, broadleaved, deciduous, closed to open (>15%)",
    val: 60
  },
  lctreebrdecic: {
    desc: "Tree cover, broadleaved, deciduous, closed (>40%)",
    val: 61
  },
  lctreebrdecio: {
    desc: "Tree cover, broadleaved, deciduous, open (15‐40%)",
    val: 62
  },
  lctreeneedevgrncto: {
    desc: "Tree cover, needleleaved, evergreen, closed to open (>15%)",
    val: 70
  },
  lctreeneedevgrnc: {
    desc: "Tree cover, needleleaved, evergreen, closed (>40%)",
    val: 71
  },
  lctreeneedevgrno: {
    desc: "Tree cover, needleleaved, evergreen, open (15‐40%)",
    val: 72
  },
  lctreeneeddecicto: {
    desc: "Tree cover, needleleaved, deciduous, closed to open (>15%)",
    val: 80
  },
  lctreeneeddecic: {
    desc: "Tree cover, needleleaved, deciduous, closed (>40%)",
    val: 81
  },
  lctreeneeddecio: {
    desc: "Tree cover, needleleaved, deciduous, open (15‐40%)",
    val: 82
  },
  lctreemix: {
    desc: "Tree cover, mixed leaf type (broadleaved and needleleaved)",
    val: 90
  },
  lcmotreeshrbherbac: {
    desc: "Mosaic tree and shrub (>50%) / herbaceous cover (<50%)",
    val: 100
  },
  lcmoherbactreeshrb: {
    desc: "Mosaic herbaceous cover (>50%) / tree and shrub (<50%)",
    val: 110
  },
  lcshrb: {
    desc: "Shrubland",
    val: 120
  },
  lcevshrb: {
    desc: "Evergreen shrubland",
    val: 121
  },
  lcdecishrb: {
    desc: "Deciduous shrubland",
    val: 122
  },
  lcgrass: {
    desc: "Grassland",
    val: 130
  },
  lclichnmos: {
    desc: "Lichens and mosses",
    val: 140
  },
  lcsparvege: {
    desc: "Sparse vegetation (tree, shrub, herbaceous cover) (<15%)",
    val: 150
  },
  lcsparstree: {
    desc: "Sparse tree (<15%)",
    val: 151
  },
  lcsparsshrb: {
    desc: "Sparse shrub (<15%)",
    val: 152
  },
  lcsparsherbac: {
    desc: "Sparse herbaceous cover (<15%)",
    val: 153
  },
  lcfldfrshbrak: {
    desc: "Tree cover, flooded, fresh or brakish water",
    val: 160
  },
  lctreefldsal: {
    desc: "Tree cover, flooded, saline water",
    val: 170
  },
  lcshrbherbacfldfrshbrak: {
    desc: "Shrub or herbaceous cover, flooded, fresh/saline/brakish water",
    val: 180
  },
  lcurban: {
    desc: "Urban areas",
    val: 190
  },
  lcbare: {
    desc: "Bare areas",
    val: 200
  },
  lcconbare: {
    desc: "Consolidated bare areas",
    val: 201
  },
  lcunconbare: {
    desc: "Unconsolidated bare areas",
    val: 202
  },
  lcwater: {
    desc: "Water bodies",
    val: 210
  },
  lcsnowice: {
    desc: "Permanent snow and ice",
    val: 220
  }
};

class MerisLandCoverLayer extends Image {
  constructor(opt_options) {
    super(opt_options);
    this.yearLayers = {
      2000: "meris_2000:landcover.meris_2000_mosaic",
      2005: "meris_2005:landcover.meris_2005_mosaic",
      2010: "meris_2010:landcover.meris_2010_mosaic",
      2015: "meris_2015:landcover.meris_2015_mosaic"
    };
  }

  /**
   * Show all classes, maybe excluding nodata. Relies on yearLayers
   * to check validity of request and pull correct layer name.
   *
   * @param {string|number} year the year of the layer to display
   */
  setYear = function(year) {
    if (year in this.yearLayers) {
      this.getSource().updateParams({ LAYERS: this.yearLayers[year] });
    } else {
      console.warn("invalid year for MERIS setYear:", year);
    }
  };

  /**
   * Show all classes, maybe excluding nodata
   *
   * @param {bool} [includeNoData=false] whether to include the nodata class
   */
  showAllClasses = function(includeNoData = false) {
    let keys = Object.keys(MerisLandCoverClasses),
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
    let keys = Object.keys(MerisLandCoverClasses),
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
   * @memberof MerisLandCoverLayer
   */
  showClasses = function(classes, opacity = 1) {
    const classSettings = {};
    let newEnvStr;

    // set all known classes to hidden
    for (let c in MerisLandCoverClasses) {
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
const layer1Meris = new MerisLandCoverLayer({
  source: new ImageWMS({
    url: "http://149.165.157.200:8080/geoserver/wms",
    params: {
      LAYERS: "meris_2015:landcover.meris_2015_mosaic",
      env: "lcnodata:0"
    },
    ratio: 1,
    serverType: "geoserver"
  }),
  opacity: 0.6
});

const layer2Meris = new MerisLandCoverLayer({
  source: new ImageWMS({
    url: "http://149.165.157.200:8080/geoserver/wms",
    params: {
      LAYERS: "meris_2015:landcover.meris_2015_mosaic",
      env: "lcnodata:0"
    },
    ratio: 1,
    serverType: "geoserver"
  }),
  opacity: 0.6
});

export { layer1Meris, layer2Meris };
