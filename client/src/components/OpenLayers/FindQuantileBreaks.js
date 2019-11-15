import { quantiles } from "qquantile";
import GetSymbolizationValueList from "./GetSymbolizationValueList";

/**
 * Given a set of features, find class breaks for quantiles.
 * Normalization (e.g. pop density from separate fields) is
 * supported, along with a normalization multipler. Univariate
 * and bivariate cases handled. Breaks are <= upper limits.
 * @param {Object[]} features array of OpenLayers features
 * @param {Object} options config options
 * @param {number} options.classCount number of classes to find breaks for
 * @param {string[]} options.prop1Names primary property name(s) to check values for
 * @param {string} [options.prop2Name] second property name to check values for; bivariate use
 */
export default function(features, options) {
  const defaultOpts = {
    classCount: undefined,
    prop1Name: [],
    prop2Name: undefined
  };
  const opts = Object.assign({}, defaultOpts, options);
  let values1, values2;

  values1 = GetSymbolizationValueList(features, opts.prop1Names);
  console.log("values1 :", values1);

  if (typeof opts.prop2Name !== "undefined") {
    values2 = GetSymbolizationValueList(features, [opts.prop2Name]);
  }

  if (!values2) {
    return [quantiles(values1, opts.classCount)];
  } else {
    // always three-class/nine-class for bivariate
    return [quantiles(values1, 3), quantiles(values2, 3)];
  }
}
