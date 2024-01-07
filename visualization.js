import * as Constants from "./constants.js";
import { drawLine, drawShelfLine, drawLabel } from "./illustrations.js";
import { glassmorphismFilter } from "./glassmorphismFilter.js";
import { moveObjectOnMouseOver, returnObjectOnMouseOut } from "./hiddenCard.js";
import { mapNumRange } from "./util.js";

/**
 *
 * @param {*} dataset
 * @param {*} keys: years
 * @param {*} chosenSort: books are to be colored by which attribute
 * @param {*} chosenSortAttr: corresponding color
 */
export function createVisualization(dataset, keys, chosenSort, chosenSortAttr) {
  d3.select("#parentDiv").select("svg").remove();

  const shelfGap = Constants.margin * 8;

  const labelYOffset = 20;
  const labelFontSize = 14;

  // dimemsions of the svg
  const width = parentDiv.clientWidth;
  const height = parentDiv.clientHeight;

  const svg = d3
    .select("#parentDiv")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // glassmorphic filter
  const filterId = glassmorphismFilter(svg, Constants.lightGrey);

  // initial x and y position for the shelf
  let shelfCurrentX = Constants.margin;
  let shelfCurrentY = Constants.colHeight + Constants.maxRectHeight / 4;

  // keys refers to the year
  keys.forEach((year) => {
    // books in every year
    const booksInEveryYear = dataset[year];

    // initial shelfCurrentX position
    var booksInEveryYearInitialX = shelfCurrentX;

    booksInEveryYear.forEach((d) => {
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

      /**
       * if the book in the booksInEveryYear is moving out of the svg, move the book to the next line
       * and add a text label
       */
      if (shelfCurrentX + rectWidth + Constants.margin > width) {
        drawLabel(
          svg,
          year,
          booksInEveryYearInitialX,
          shelfCurrentY + labelYOffset,
          shelfCurrentX,
          labelFontSize
        );

        drawShelfLine(
          svg,
          booksInEveryYearInitialX,
          shelfCurrentY,
          shelfCurrentX,
          2,
          "black",
          Constants.margin
        );

        shelfCurrentX = Constants.margin;
        shelfCurrentY += Constants.colHeight;
        booksInEveryYearInitialX = shelfCurrentX;

        // svg
        //   .append("text")
        //   .text(year)
        //   .attr("fill", "black")
        //   .attr("font-size", "14px")
        //   .attr("x", shelfCurrentX)
        //   .attr("y", shelfCurrentY + 20);
      }

      const rectX = shelfCurrentX;
      const rectY = shelfCurrentY - rectHeight;

      if (shelfCurrentY > height) {
        height += Constants.colHeight;
      }

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
      Constants.books.bookGroup = null;

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

      shelfCurrentX += rectWidth;
    });

    drawShelfLine(
      svg,
      booksInEveryYearInitialX,
      shelfCurrentY,
      shelfCurrentX,
      2,
      "black",
      Constants.margin
    );

    drawLabel(
      svg,
      year,
      booksInEveryYearInitialX,
      shelfCurrentY + labelYOffset,
      shelfCurrentX,
      labelFontSize
    );

    if (shelfCurrentX > width) {
      shelfCurrentY += groupHeight;
      shelfCurrentX = Constants.margin;
    } else {
      shelfCurrentX += shelfGap;
    }
  });
}
