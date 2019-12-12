import React, { Component } from "react";
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  ChartLabel
} from "react-vis";

class BarGraph extends Component {
  render() {
    var data = this.props.graphData.data;
    const xLabel = this.props.graphData.xLabel;

    if (data != null) {
      for (var i = 0; i < data.length; i++) {
        data[i]["x"] = data[i]["x"].replace(" &ndash; ", "-");
      }
    }

    return (
      <FlexibleXYPlot xType="ordinal" colorType="literal">
        <XAxis tickLabelAngle={-10} />
        <YAxis />
        <VerticalBarSeries data={data} />
        <ChartLabel text={xLabel} xPercent={0.4} />
      </FlexibleXYPlot>
    );
  }
}

export default BarGraph;
