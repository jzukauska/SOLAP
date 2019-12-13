import ImageWMS from "ol/source/ImageWMS";
import { Image } from "ol/layer";
import { asArray as colorAsArray, asString as colorAsString } from "ol/color";

//https://maps.elie.ucl.ac.be/CCI/viewer/download/CCI-LC_Maps_Legend.pdf
const MerisLandCoverClasses = {
  lcnodata: {
    desc: "No Data",
    val: 0,
    color: "#000000"
  },
  lccroprain: {
    desc: "Cropland, rainfed",
    val: 10,
    color: "#ffff64"
  },
  lcherbac: {
    desc: "Herbaceous cover",
    val: 11,
    color: "#ffff64"
  },
  lctreeshrb: {
    desc: "Tree or shrub cover",
    val: 12,
    color: "#ffff64"
  },
  lccropirripofld: {
    desc: "Cropland, irrigated or post‐flooding",
    val: 20,
    color: "#aaf2ef"
  },
  lcmocropnatvege: {
    desc:
      "Mosaic cropland (>50%) / natural vegetation (tree, shrub, herbaceous cover) (<50%)",
    val: 30,
    color: "#ddf063"
  },
  lcmonatvegecrop: {
    desc:
      "Mosaic natural vegetation (tree, shrub, herbaceous cover) (>50%) / cropland (<50%)  ",
    val: 40,
    color: "#c8c864"
  },
  lctreebrevgrncto: {
    desc: "Tree cover, broadleaved, evergreen, closed to open (>15%)",
    val: 50,
    color: "#52dd30"
  },
  lctreebrdecicto: {
    desc: "Tree cover, broadleaved, deciduous, closed to open (>15%)",
    val: 60,
    color: "#00a100"
  },
  lctreebrdecic: {
    desc: "Tree cover, broadleaved, deciduous, closed (>40%)",
    val: 61,
    color: "#00a100"
  },
  lctreebrdecio: {
    desc: "Tree cover, broadleaved, deciduous, open (15‐40%)",
    val: 62,
    color: "#aec802"
  },
  lctreeneedevgrncto: {
    desc: "Tree cover, needleleaved, evergreen, closed to open (>15%)",
    val: 70,
    color: "#013b00"
  },
  lctreeneedevgrnc: {
    desc: "Tree cover, needleleaved, evergreen, closed (>40%)",
    val: 71,
    color: "#013b01"
  },
  lctreeneedevgrno: {
    desc: "Tree cover, needleleaved, evergreen, open (15‐40%)",
    val: 72,
    color: "#034f00"
  },
  lctreeneeddecicto: {
    desc: "Tree cover, needleleaved, deciduous, closed to open (>15%)",
    val: 80,
    color: "#294f02"
  },
  lctreeneeddecic: {
    desc: "Tree cover, needleleaved, deciduous, closed (>40%)",
    val: 81,
    color: "#294f02"
  },
  lctreeneeddecio: {
    desc: "Tree cover, needleleaved, deciduous, open (15‐40%)",
    val: 82,
    color: "#256602"
  },
  lctreemix: {
    desc: "Tree cover, mixed leaf type (broadleaved and needleleaved)",
    val: 90,
    color: "#788301"
  },
  lcmotreeshrbherbac: {
    desc: "Mosaic tree and shrub (>50%) / herbaceous cover (<50%)",
    val: 100,
    color: "#8ba001"
  },
  lcmoherbactreeshrb: {
    desc: "Mosaic herbaceous cover (>50%) / tree and shrub (<50%)",
    val: 110,
    color: "#bc9800"
  },
  lcshrb: {
    desc: "Shrubland",
    val: 120,
    color: "#966401"
  },
  lcevshrb: {
    desc: "Evergreen shrubland",
    val: 121,
    color: "#794b00"
  },
  lcdecishrb: {
    desc: "Deciduous shrubland",
    val: 122,
    color: "#966401"
  },
  lcgrass: {
    desc: "Grassland",
    val: 130,
    color: "#ffb432"
  },
  lclichnmos: {
    desc: "Lichens and mosses",
    val: 140,
    color: "#fddbd1"
  },
  lcsparvege: {
    desc: "Sparse vegetation (tree, shrub, herbaceous cover) (<15%)",
    val: 150,
    color: "#ffecb1"
  },
  lcsparstree: {
    desc: "Sparse tree (<15%)",
    val: 151,
    color: "#ffc766"
  },
  lcsparsshrb: {
    desc: "Sparse shrub (<15%)",
    val: 152,
    color: "#ffd476"
  },
  lcsparsherbac: {
    desc: "Sparse herbaceous cover (<15%)",
    val: 153,
    color: "#ffeab4"
  },
  lcfldfrshbrak: {
    desc: "Tree cover, flooded, fresh or brakish water",
    val: 160,
    color: "#017a5b"
  },
  lctreefldsal: {
    desc: "Tree cover, flooded, saline water",
    val: 170,
    color: "#019879"
  },
  lcshrbherbacfldfrshbrak: {
    desc: "Shrub or herbaceous cover, flooded, fresh/saline/brakish water",
    val: 180,
    color: "#02dc85"
  },
  lcurban: {
    desc: "Urban areas",
    val: 190,
    color: "#c31500"
  },
  lcbare: {
    desc: "Bare areas",
    val: 200,
    color: "#fff6d9"
  },
  lcconbare: {
    desc: "Consolidated bare areas",
    val: 201,
    color: "#dcdcdc"
  },
  lcunconbare: {
    desc: "Unconsolidated bare areas",
    val: 202,
    color: "#fff6d9"
  },
  lcwater: {
    desc: "Water bodies",
    val: 210,
    color: "#0045c6"
  },
  lcsnowice: {
    desc: "Permanent snow and ice",
    val: 220,
    color: "#ffffff"
  }
};

for (let c in MerisLandCoverClasses) {
  MerisLandCoverClasses[c].colorRgba = colorAsString(
    colorAsArray(MerisLandCoverClasses[c].color)
      .slice(0, 3)
      .concat(0.6) // adjust opacity
  );
}

class MerisLandCoverLayer extends Image {
  constructor(opt_options) {
    super(opt_options);
    this.yearLayers = {
      1994: "minnesota:MN_MERIS_ANNUAL_1994",
      1995: "minnesota:MN_MERIS_ANNUAL_1995",
      1996: "minnesota:MN_MERIS_ANNUAL_1996",
      1997: "minnesota:MN_MERIS_ANNUAL_1997",
      1998: "minnesota:MN_MERIS_ANNUAL_1998",
      1999: "minnesota:MN_MERIS_ANNUAL_1999",
      2000: "minnesota:MN_MERIS_ANNUAL_2000",
      2001: "minnesota:MN_MERIS_ANNUAL_2001",
      2002: "minnesota:MN_MERIS_ANNUAL_2002",
      2003: "minnesota:MN_MERIS_ANNUAL_2003",
      2004: "minnesota:MN_MERIS_ANNUAL_2004",
      2005: "minnesota:MN_MERIS_ANNUAL_2005",
      2006: "minnesota:MN_MERIS_ANNUAL_2006",
      2007: "minnesota:MN_MERIS_ANNUAL_2007",
      2008: "minnesota:MN_MERIS_ANNUAL_2008",
      2009: "minnesota:MN_MERIS_ANNUAL_2009",
      2010: "minnesota:MN_MERIS_ANNUAL_2010",
      2011: "minnesota:MN_MERIS_ANNUAL_2011",
      2012: "minnesota:MN_MERIS_ANNUAL_2012",
      2013: "minnesota:MN_MERIS_ANNUAL_2013",
      2014: "minnesota:MN_MERIS_ANNUAL_2014",
      2015: "minnesota:MN_MERIS_ANNUAL_2015"
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
      LAYERS: "minnesota:MN_MERIS_ANNUAL_2015",
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
      LAYERS: "minnesota:MN_MERIS_ANNUAL_2015",
      env: "lcnodata:0"
    },
    ratio: 1,
    serverType: "geoserver"
  }),
  opacity: 0.6
});

export { layer1Meris, layer2Meris, MerisLandCoverClasses };
