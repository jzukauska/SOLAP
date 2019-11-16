/**
 * MN county layer
 */
import React from "react";

import { Vector as VectorLayer } from "ol/layer";
import MnCountySource from "./MnCountySource";
import BasicPolygon from "./Style/BasicPolygon";

class MnCountyLayer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <VectorLayer name="mn_county_2010" source={MnCountySource} style={BasicPolygon}/>
    );
  }
}

export default MnCountyLayer;
