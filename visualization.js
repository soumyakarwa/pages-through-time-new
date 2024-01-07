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

  const offset = 6;
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
  let shelfX = offset;
  let shelfY = Constants.colHeight + Constants.maxRectHeight / 4;

  // keys refers to the year
  keys.forEach((year) => {
    // books in every year
    const booksInEveryYear = dataset[year];

    var booksInEveryYearInitialX = shelfX;
    // year label
    // svg
    //   .append("text")
    //   .text(year)
    //   .attr("fill", "black")
    //   .attr("font-size", "14px")
    //   .attr("x", shelfX)
    //   .attr("y", shelfY + 20);

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
      if (shelfX + rectWidth + offset > width) {
        drawLabel(svg, year, booksInEveryYearInitialX, shelfY + 20, shelfX, 14);

        drawShelfLine(
          svg,
          booksInEveryYearInitialX,
          shelfY,
          shelfX,
          2,
          "black",
          offset
        );

        shelfX = offset;
        shelfY += Constants.colHeight;
        booksInEveryYearInitialX = shelfX;

        // svg
        //   .append("text")
        //   .text(year)
        //   .attr("fill", "black")
        //   .attr("font-size", "14px")
        //   .attr("x", shelfX)
        //   .attr("y", shelfY + 20);
      }

      const rectX = shelfX;
      const rectY = shelfY - rectHeight;

      if (shelfY > height) {
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

      shelfX += rectWidth;
    });

    drawShelfLine(
      svg,
      booksInEveryYearInitialX,
      shelfY,
      shelfX,
      2,
      "black",
      offset
    );

    drawLabel(svg, year, booksInEveryYearInitialX, shelfY + 20, shelfX, 14);

    if (shelfX > width) {
      shelfY += groupHeight;
      shelfX = 0;
    } else {
      shelfX += 50;
    }
  });
}
