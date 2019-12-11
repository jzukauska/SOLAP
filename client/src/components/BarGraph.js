import React, { Component } from "react";
import { FlexibleXYPlot, XAxis, YAxis, VerticalBarSeries } from "react-vis";

class BarGraph extends Component {
  render() {
    const data = [
      { y: 5, x: "A", color: "#46019B" },
      { y: 10, x: "B", color: "#007EFE" },
      { y: 25, x: "C", color: "00BB00" },
      { y: 20, x: "D", color: "FEF601" },
      { y: 10, x: "E", color: "DD0000" }
    ];
    const colors = ["#46019B", "#007EFE", "00BB00", "FEF601", "DD0000"];
    return (
      <FlexibleXYPlot xType="ordinal" colorType="category" colorRange={colors}>
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={data} />
      </FlexibleXYPlot>
    );
  }
}

export default BarGraph;
