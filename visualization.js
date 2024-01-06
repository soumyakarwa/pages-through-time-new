import * as Constants from "./constants.js";
import { drawLine } from "./drawLine.js";
import { glassmorphismFilter } from "./glassmorphismFilter.js";
import { moveObjectOnMouseOver, returnObjectOnMouseOut } from "./hiddenCard.js";
import { mapNumRange } from "./util.js";

export function createVisualization(dataset, keys, chosenSort, chosenSortAttr) {
  d3.select("#parentDiv").select("svg").remove();

  // creating visualization
  const width = parentDiv.clientWidth;
  const height = Constants.colHeight * keys.length + Constants.margin;

  // VISUALIZATION
  const svg = d3
    .select("#parentDiv")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const filterId = glassmorphismFilter(svg, Constants.lightGrey);

  const books = {};

  // creating stacks
  let yOffset = Constants.colHeight + Constants.maxRectHeight / 4;
  let xOffset = 0;
  keys.forEach((year) => {
    const yearData = dataset[year];
    const groupHeight = Constants.colHeight;

    svg
      .append("rect")
      .attr("x", xOffset)
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
      const rectX = xOffset;
      const rectY = yOffset - rectHeight;
      var rectColor;
      switch (chosenSort) {
        case Constants.emotions:
          var rectColor = chosenSortAttr[d.Emotion];
          break;
        case Constants.genres:
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

    if (xOffset > width) {
      yOffset += groupHeight;
      xOffset = 0;
    } else {
      xOffset += 50;
    }

    // yOffset += groupHeight;
  });
}
