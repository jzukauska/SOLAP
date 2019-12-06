import React, { Component } from "react";
import ColorBrewerStyles from "./OpenLayers/Style/ColorBrewerStyles";
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  XYPlot,
  LabelSeries
} from "react-vis";

class BarGraph extends Component {
  render() {
    const data = [
      { y: 5, x: "A" },
      { y: 10, x: "B" },
      { y: 25, x: "C" },
      { y: 20, x: "D" },
      { y: 10, x: "E" }
    ];
    return (
      <FlexibleXYPlot xType="ordinal">
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={data} />
      </FlexibleXYPlot>
    );
  }
}

export default BarGraph;
