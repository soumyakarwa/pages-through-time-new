import { displayRating, getScaledStarDimensions } from "./displayRating.js";
import * as Constants from "./constants.js";
import {
  calculateHiddenRectX,
  calculateHiddenRectY,
  wrapText,
} from "./util.js";

/**
 * Moves the book up and displays the glassmorphic card
 * @param {*} svg
 * @param {*} svgWidth
 * @param {*} svgHeight
 * @param {*} dataPoint: book being hovered upon
 */
export function moveObjectOnMouseOver(svg, svgWidth, svgHeight, dataPoint) {
  const book = d3.select(this);
  let hiddenRectWidth = 250;
  let hiddenRectHeight = 150;
  let imgWidth = 80;
  let hiddenRectX = calculateHiddenRectX(
    this.originalX,
    this.width,
    svgWidth,
    hiddenRectWidth
  );
  let hiddenRectY = calculateHiddenRectY(
    this.originalY,
    this.height,
    svgHeight,
    hiddenRectHeight
  );
  let textContainerWidth = hiddenRectWidth - imgWidth - 4 * Constants.margin;
  let textContainerX = hiddenRectX + Constants.margin * 3 + imgWidth;
  let textContainerY = hiddenRectY + Constants.margin + 1;
  let titleFontSize = 13;
  let bodyFontSize = 10;
  let lineSpacing = 13;

  this.hiddenRect = svg.append("g");

  this.hiddenRect
    .append("rect")
    .attr("x", hiddenRectX)
    .attr("y", hiddenRectY)
    .attr("width", hiddenRectWidth)
    .attr("height", hiddenRectHeight)
    .style("fill", "rgb(255, 255, 255)")
    .style("fill-opacity", "0.7")
    .style("stroke", "rgb(255, 255, 255)")
    .style("stroke-opacity", "0.7")
    .style("mix-blend-mode", "luminosity")
    .style("stroke-width", 0.5)
    .attr("filter", "url(#drop-shadow)")
    .attr("rx", 5)
    .attr("ry", 5);

  this.hiddenRect
    .append("rect")
    .attr("x", hiddenRectX + Constants.margin)
    .attr("y", hiddenRectY + Constants.margin)
    .attr("height", hiddenRectHeight - Constants.margin * 2)
    .attr("width", imgWidth)
    .style("fill", Constants.lightGrey);

  let prevLineY = textContainerY;
  if (dataPoint.Series != "") {
    prevLineY =
      wrapText(
        this.hiddenRect,
        dataPoint.Series,
        textContainerWidth,
        textContainerX,
        textContainerY,
        lineSpacing,
        bodyFontSize,
        "italic",
        Constants.mediumGrey
      ) + lineSpacing;
  }
  prevLineY =
    wrapText(
      this.hiddenRect,
      dataPoint.Book,
      textContainerWidth,
      textContainerX,
      prevLineY,
      lineSpacing,
      titleFontSize,
      "normal",
      "black"
    ) +
    lineSpacing +
    1;

  prevLineY =
    wrapText(
      this.hiddenRect,
      "by " + dataPoint.Author,
      textContainerWidth,
      textContainerX,
      prevLineY,
      lineSpacing,
      bodyFontSize,
      "normal",
      "black"
    ) +
    lineSpacing +
    4;

  const ratingX = displayRating(
    this.hiddenRect,
    dataPoint.Rating,
    textContainerX,
    prevLineY,
    Constants.goldenColor
  );
  prevLineY += getScaledStarDimensions()[1] / 1.5 + lineSpacing;

  prevLineY =
    wrapText(
      this.hiddenRect,
      dataPoint.Length + " pages",
      textContainerWidth,
      textContainerX,
      prevLineY,
      lineSpacing,
      bodyFontSize,
      "normal",
      Constants.mediumGrey
    ) +
    lineSpacing +
    4;

  prevLineY =
    wrapText(
      this.hiddenRect,
      dataPoint.Genres,
      textContainerWidth,
      textContainerX,
      prevLineY,
      lineSpacing - 1,
      bodyFontSize,
      "normal",
      "black"
    ) +
    lineSpacing +
    4;

  prevLineY =
    wrapText(
      this.hiddenRect,
      dataPoint.Emotion,
      textContainerWidth,
      textContainerX,
      prevLineY,
      lineSpacing,
      bodyFontSize,
      "normal",
      this.rectColor
    ) +
    lineSpacing +
    4;

  prevLineY =
    wrapText(
      this.hiddenRect,
      "Published: " +
        dataPoint.Year_Published +
        "; Read: " +
        dataPoint.Year_Read,
      textContainerWidth,
      textContainerX,
      prevLineY,
      lineSpacing,
      bodyFontSize,
      "normal",
      Constants.mediumGrey
    ) + lineSpacing;

  if (prevLineY > hiddenRectY + hiddenRectHeight) {
    let newRectHeight = prevLineY - hiddenRectY + 2 * Constants.margin;

    this.hiddenRect.select("rect").attr("height", newRectHeight);
  }

  book.transition().attr("transform", "translate(0, " + -this.height / 4 + ")");

  this.hiddenRect
    .transition()
    .attr("transform", "translate(0, " + -this.height / 4 + ")")
    .style("visibility", "visible");
}

/**
 * Returns the object to the original position
 */
export function returnObjectOnMouseOut() {
  const book = d3.select(this);
  book.transition().attr("transform", "translate(0, 0)");
  this.hiddenRect
    .transition()
    .attr("transform", "translate(0, 0)")
    .style("visibility", "hidden");
}
