/**
 * Extract values from features from a single property, from
 * two properties (divide-by, e.g. area normalization), or
 * from two properties multiplied by some factor.
 * @param {Object[]} features array of OpenLayers features
 * @param {string[]} propNames property name(s) to check; adds values of each
 */
export default function(features, propNames) {
  const values = [];
  let featProps, featSum;
  for (let i = 0; i < features.length; i++) {
    featProps = features[i].getProperties();
    featSum = 0;

    // TODO: handle missing properties case here (warn only?)
    for (let i = 0; i < propNames.length; i++) {
      featSum += parseFloat(featProps[propNames[i]]);
    }
    values.push(featSum);
  }

  return values;
}
