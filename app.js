import { mapAttrColor } from "./util.js";
import { createVisualization } from "./visualization.js";
import { createLegend } from "./legend.js";
import * as Constants from "./constants.js";

const emotionColorMap = {};
const genreColorMap = {};

mapAttrColor(Constants.emotions, emotionColorMap);
mapAttrColor(Constants.genres, genreColorMap);

// DATA PROCESSING
// groupedByYear contains books separated by the year i read them
const groupedByYear = Constants.data.reduce((acc, d) => {
  const year = d["Year_Read"];
  if (!acc[year]) {
    acc[year] = [];
  }
  acc[year].push(d);
  return acc;
}, {});

const yearKeys = Object.keys(groupedByYear);

var selectedOption = "Emotion";
var chosenSort = Constants.genres;
var chosenSortAttr = genreColorMap;
const options = ["Emotion", "Genre"];

createVisualization(groupedByYear, yearKeys, chosenSort, chosenSortAttr);

// createLegend(chosenSort);

// const dropdown = d3.select("#emotion-dropdown");
// options.forEach((option) => {
//   dropdown.append("option").attr("value", option).text(option);
// });

// dropdown
//   .style("margin-top", 1.25 * Constants.margin + "px")
//   .style("margin-left", 8.5 * Constants.margin + "px");

// dropdown.on("change", function () {
//   selectedOption = d3.select(this).property("value");
//   switch (selectedOption) {
//     case "Emotion":
//       chosenSort = Constants.emotions;
//       chosenSortAttr = emotionColorMap;
//       break;
//     case "Genre":
//       chosenSort = Constants.genres;
//       chosenSortAttr = genreColorMap;
//       break;
//   }
//   createVisualization(groupedByYear, yearKeys, chosenSort, chosenSortAttr);
//   createLegend(chosenSort);
// });

// SVG BORDERS
// svg.append('ellipse')
//   .attr('cx', 0)
//   .attr('cy', height) // Centers the ellipse vertically
//   .attr('rx', 5) // Example radius along the x-axis
//   .attr('ry', 5) // Example radius along the y-axis
//   .attr('fill', "#900E00");

// svg.append('ellipse')
//   .attr('cx', width)
//   .attr('cy', height) // Centers the ellipse vertically
//   .attr('rx', 5) // Example radius along the x-axis
//   .attr('ry', 5) // Example radius along the y-axis
//   .attr('fill', "#900E00");

// svg.append('ellipse')
//   .attr('cx', width)
//   .attr('cy', 0) // Centers the ellipse vertically
//   .attr('rx', 5) // Example radius along the x-axis
//   .attr('ry', 5) // Example radius along the y-axis
//   .attr('fill', "#900E00");

// svg.append('ellipse')
//   .attr('cx', 0)
//   .attr('cy', 0) // Centers the ellipse vertically
//   .attr('rx', 5) // Example radius along the x-axis
//   .attr('ry', 5) // Example radius along the y-axis
//   .attr('fill', "#900E00");
