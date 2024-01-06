import { drawLine } from "./drawLine.js";
import { glassmorphismFilter } from "./glassmorphismFilter.js";
import { mapAttrColor, mapNumRange } from "./util.js";
import { moveObjectOnMouseOver, returnObjectOnMouseOut } from "./hiddenCard.js";
import * as Constants from "./constants.js";

// EMOTIONS CATEGORIES
const negativeEmotions = {
  attributes: ["Outrage", "Fear", "Repulsion"],
  color: Constants.redColor,
};
const inBetweenEmotions = {
  attributes: ["Indifference", "Apprehension", "Confusion"],
  color: Constants.greyColor,
};
const hookedOntoEmotions = {
  attributes: ["Amusement", "Excitement"],
  color: Constants.yellowColor,
};
const unxpectedEmotions = {
  attributes: ["Wonder", "Surprise", "Anticipation"],
  color: Constants.greenColor,
};
const sadEmotions = {
  attributes: ["Despair", "Loss"],
  color: Constants.blueColor,
};
const relatableEmotions = {
  attributes: ["Nostalgia", "Amorous", "Relief"],
  color: Constants.pinkColor,
};

const emotions = [
  negativeEmotions,
  inBetweenEmotions,
  hookedOntoEmotions,
  unxpectedEmotions,
  sadEmotions,
  relatableEmotions,
];
const emotionColorMap = {};
mapAttrColor(emotions, emotionColorMap);

// GENRE CATEGORIES
const fantasy = {
  attributes: ["Fantasy", "Urban Fantasy"],
  color: Constants.redColor,
};
const thriller = {
  attributes: ["Mystery", "Crime"],
  color: Constants.greyColor,
};
const dys = {
  attributes: ["Dystopia", "Thriller", "Adventure"],
  color: Constants.yellowColor,
};
const ancient = {
  attributes: ["Mythology", "Retellings", "Historical Fiction"],
  color: Constants.greenColor,
};
const misc = { attributes: ["Non-Fiction"], color: Constants.blueColor };
const romance = {
  attributes: ["Romance", "Chick Lit", "Contemporary"],
  color: Constants.pinkColor,
};

const genres = [fantasy, thriller, dys, romance, misc, ancient];
const genreColorMap = {};
mapAttrColor(genres, genreColorMap);

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

// HELPER FUNCTIONS

function createVisualization(chosenSort, chosenSortAttr) {
  d3.select("#parentDiv").select("svg").remove();

  // creating visualization
  const width = parentDiv.clientWidth;
  const height = Constants.colHeight * yearKeys.length + Constants.margin;

  // VISUALIZATION
  const svg = d3
    .select("#parentDiv")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const filterId = glassmorphismFilter(svg, Constants.lightGrey);

  const books = {};

  // creating stacks
  let yOffset = Constants.maxRectHeight;
  let xOffset = 0;
  yearKeys.forEach((year) => {
    const yearData = groupedByYear[year];
    const groupHeight = Constants.colHeight;
    yearData.forEach((d, i) => {
      const rectWidth = mapNumRange(
        d.Length,
        Constants.minLength,
        Constants.maxLength,
        Constants.minRectWidth,
        Constants.maxRectWidth
      );
      const rectHeight = mapNumRange(
        d.Rating,
        Constants.minRating,
        Constants.maxRating,
        Constants.minRectHeight,
        Constants.maxRectHeight
      );
      const rectX = xOffset + Constants.colHeight / 3;
      const rectY = yOffset - rectHeight;
      var rectColor;
      switch (chosenSort) {
        case emotions:
          console.log("chosenSort is emotions");
          var rectColor = chosenSortAttr[d.Emotion];
          break;
        case genres:
          var rectColor = chosenSortAttr[d.Prominent_Genre];
          break;
      }
      const bookGroup = svg.append("g");
      books.bookGroup = null;

      bookGroup.each(function (d) {
        this.originalX = rectX;
        this.originalY = rectY;
        this.height = rectHeight;
        this.width = rectWidth;
        this.color = rectColor;
        this.hiddenRect = null;
        this.d = d;
        this.rectColor = rectColor;
      });

      bookGroup
        .append("rect")
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("fill", rectColor)
        .attr("rx", 2.5)
        .attr("ry", 2.5);

      drawLine(bookGroup, Constants.lightGrey);

      bookGroup
        .on("mouseover", function () {
          moveObjectOnMouseOver.call(this, svg, width, height, d);
        })
        .on("mouseout", returnObjectOnMouseOut)
        .attr("cursor", "pointer");

      xOffset += rectWidth;
    });

    svg
      .append("rect")
      .attr("x", Constants.colHeight / 3 - 7.5)
      .attr("y", yOffset)
      .attr("width", xOffset + 15)
      .attr("height", 3)
      .attr("fill", "black");

    svg
      .append("text")
      .text(year)
      .attr("fill", "black")
      .attr("font-size", "14px")
      .attr("x", xOffset)
      .attr("y", yOffset + 20);

    if (xOffset > width) {
      yOffset += groupHeight;
      xOffset = 0;
    } else {
      xOffset += 50;
    }

    // yOffset += groupHeight;
  });
}

// LEGEND
function createLegend(chosenSort) {
  d3.select("#legend-container").select("svg").remove();
  const legendWidth = 240 + 2 * margin;
  const legendHeight = chosenSort.length * 20 + 5 * margin + 2;

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
    .attr("x", 2 * margin)
    .attr("y", 3 * margin)
    .attr("fill", "black")
    .attr("font-size", "14px")
    .attr("dominant-baseline", "top")
    .text("Color by ");

  chosenSort.forEach((item, index) => {
    legend
      .append("rect")
      .attr("x", 2 * margin)
      .attr("y", 5 * margin + index * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", item.color);

    legend
      .append("text")
      .attr("fill", "black")
      .attr("font-size", "12px")
      .attr("dominant-baseline", "hanging")
      .attr("x", 4 * margin)
      .attr("y", 5 * margin + index * 20)
      .text(item.attributes.join(", "));
  });
}

var selectedOption = "Emotion";
var chosenSort = emotions;
var chosenSortAttr = emotionColorMap;
const options = ["Emotion", "Genre"];
// const dropdown = d3.select("#emotion-dropdown");
//   options.forEach(option => {
//     dropdown.append("option")
//       .attr("value", option)
//       .text(option);
// });

// dropdown
//   .style('margin-top', 1.25*margin + 'px')
//   .style('margin-left', 8.5*margin + 'px');

createVisualization(chosenSort, chosenSortAttr);

// createLegend(chosenSort);

// dropdown.on("change", function() {
//   selectedOption = d3.select(this).property("value");
//   switch(selectedOption){
//     case "Emotion":
//       chosenSort = emotions;
//       chosenSortAttr = emotionColorMap;
//       break;
//     case "Genre":
//       chosenSort = genres;
//       chosenSortAttr = genreColorMap;
//       break;
//   }
//   createVisualization(chosenSort, chosenSortAttr);
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
