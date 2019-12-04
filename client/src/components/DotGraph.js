import React, {Component} from "react";
import * as d3 from "d3";

class BarGraph extends Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    var svgWidth = d3.select("#graph").node().offsetWidth - 50;
    var svgHeight = 100;

    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    var dataset = [80, 100, 56, 120, 180];

    var barPadding = 5;
    var barWidth = (svgWidth / dataset.length);

    var barChart = svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("y", function(d) {
          return svgHeight - d
      })
      .attr("height", function(d) {
          return d;
      })
      .attr("width", barWidth - barPadding)
      .attr("transform", function (d, i) {
           var translate = [barWidth * i, 0];
           return "translate("+ translate +")";
      });
  }

  render(){
    return <div id="graph"></div>
  }
}

export default BarGraph;
