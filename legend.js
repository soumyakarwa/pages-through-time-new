import * as Constants from "./constants.js";

export function createLegend(chosenSort) {
  d3.select("#legend-container").select("svg").remove();
  const legendWidth = 240 + 2 * Constants.margin;
  const legendHeight = chosenSort.length * 20 + 5 * Constants.margin + 2;

  const legendContainer = d3
    .select("#legend-container")
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("viewBox", `0 0 ${legendWidth} ${legendHeight}`);

  const legend = legendContainer.append("g").attr("class", "legend");

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0.5)
    .attr("width", legendWidth)
    .attr("height", legendHeight - 1)
    .attr("fill", "#F9F6EE")
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  legend
    .append("text")
    .attr("x", 2 * Constants.margin)
    .attr("y", 3 * Constants.margin)
    .attr("fill", "black")
    .attr("font-size", "14px")
    .attr("dominant-baseline", "top")
    .text("Color by ");

  chosenSort.forEach((item, index) => {
    legend
      .append("rect")
      .attr("x", 2 * Constants.margin)
      .attr("y", 5 * Constants.margin + index * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", item.color);

    legend
      .append("text")
      .attr("fill", "black")
      .attr("font-size", "12px")
      .attr("dominant-baseline", "hanging")
      .attr("x", 4 * Constants.margin)
      .attr("y", 5 * Constants.margin + index * 20)
      .text(item.attributes.join(", "));
  });
}
