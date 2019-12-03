import React, {Component} from 'react';
import * as d3 from "d3";

class DotGraph extends Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const data = [12, 5, 6, 6, 9, 10];
    const svg = d3.select("body")
    .append("svg")
  }

  render(){
    return <div id={"#" + this.props.id}></div>
  }
}

export default DotGraph;
