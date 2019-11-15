import ColorBrewerStyles from "./ColorBrewerStyles";
import BivariatePolygon from "./BivariatePolygon";

/**
 * Return a custom style function using a ColorBrewer ramp for univariate
 * and a single-option set of colors (3x3) for bivariate cases.
 * @param {string[][]} breaks one-item or two-item array of class breaks (high end, <=)
 * @param {Object} options config options
 * @param {string[]} options.prop1Names primary property name(s) to check values
 * @param {string} [options.prop2Name] second property name to check values for; bivariate use
 * @param {string} [options.colorbrewerRampId=YlGnBu] ColorBrewer ramp ID to use for univariate cases
 */
export default function(breaks, options) {
  const defaultOpts = {
    prop1Names: [],
    prop2Name: undefined,
    colorbrewerRampId: "YlGnBu"
  };

  console.log("breaks :", breaks);
  const opts = Object.assign({}, defaultOpts, options);

  // console.log("opts :", opts);
  // univariate
  if (breaks.length === 1) {
    // console.log("break are one");
    return function(feature) {
      let testVal = 0,
        featProps = feature.getProperties(),
        numClasses = breaks[0].length;

      for (let i = 0; i < opts.prop1Names.length; i++) {
        testVal += parseFloat(featProps[opts.prop1Names[i]]);
      }
      // console.log("testVal :", testVal);

      for (let i = 0; i < numClasses; i++) {
        // console.log("returning styles for break", i);
        if (testVal <= breaks[0][i]) {
          // console.log("returning styles for break", i);
          return ColorBrewerStyles[opts.colorbrewerRampId][numClasses][i];
        }
      }
    };
  }

  // bivariate, always three classes
  if (breaks.length === 2) {
    return function(feature) {
      let testVal1 = 0,
        testVal2 = 0,
        featProps = feature.getProperties(),
        numClasses = 3;

      for (let i = 0; i < opts.prop1Names.length; i++) {
        testVal1 += parseFloat(featProps[opts.prop1Names[i]]);
      }

      testVal2 = featProps[opts.prop2Name];

      for (let i = 0; i < numClasses; i++) {
        if (testVal1 <= breaks[0][i]) {
          for (let j = 0; j < numClasses; j++) {
            if (testVal2 <= breaks[1][j]) {
              return BivariatePolygon[i][j];
            }
          }
        }
      }
    };
  }
}
