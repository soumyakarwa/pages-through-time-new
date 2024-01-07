import { getTextWidth } from "./util.js";

/**
 * This function draws lines on each book spine to add some dimension.
 * @param {*} book: the book on which the lines are being drawn
 * @param {*} lightGrey: a possibe color of the lines
 */
export function drawLine(book, lightGrey) {
  let combination = Math.floor(Math.random() * 3);
  book.each(function () {
    // Access the properties of the DOM element
    const groupElement = d3.select(this);
    const originalX = this.originalX;
    const originalY = this.originalY;
    const width = this.width;
    const height = this.height;
    const lineColor = this.color == "#F6CBD6" ? "#BFBFBF" : lightGrey;

    switch (combination) {
      case 0:
        groupElement
          .append("line")
          .attr("x1", originalX + 1)
          .attr("y1", originalY + 3)
          .attr("x2", originalX + width - 1)
          .attr("y2", originalY + 3)
          .attr("stroke", lineColor)
          .attr("stroke-width", 0.5);

        groupElement
          .append("line")
          .attr("x1", originalX + 1)
          .attr("y1", originalY + height - 3)
          .attr("x2", originalX + width - 1)
          .attr("y2", originalY + height - 3)
          .attr("stroke", lineColor)
          .attr("stroke-width", 0.5);
        break;
      case 1:
        groupElement
          .append("line")
          .attr("x1", originalX + width / 9)
          .attr("y1", originalY)
          .attr("x2", originalX + width / 9)
          .attr("y2", originalY + height)
          .attr("stroke", lineColor)
          .attr("stroke-width", 0.5);

        groupElement
          .append("line")
          .attr("x1", originalX + width / 9 + 3)
          .attr("y1", originalY)
          .attr("x2", originalX + width / 9 + 3)
          .attr("y2", originalY + height)
          .attr("stroke", lineColor)
          .attr("stroke-width", 0.5);

        groupElement
          .append("line")
          .attr("x1", originalX + width - width / 9 - 3)
          .attr("y1", originalY)
          .attr("x2", originalX + width - width / 9 - 3)
          .attr("y2", originalY + height)
          .attr("stroke", lineColor)
          .attr("stroke-width", 0.5);

        groupElement
          .append("line")
          .attr("x1", originalX + width - width / 9 - 6)
          .attr("y1", originalY)
          .attr("x2", originalX + width - width / 9 - 6)
          .attr("y2", originalY + height)
          .attr("stroke", lineColor)
          .attr("stroke-width", 0.5);

        break;
      case 2:
        groupElement
          .append("line")
          .attr("x1", originalX + width / 10)
          .attr("y1", originalY)
          .attr("x2", originalX + width / 10)
          .attr("y2", originalY + height)
          .attr("stroke", lineColor)
          .attr("stroke-width", 1);
        break;
    }
  });
}

/**
 * This function draws the shelf line for every separated bookshelf (according to year
 * or rating etc)
 * @param {*} svg
 * @param {*} initialX: x position of the first book
 * @param {*} initialY: y position of the first book
 * @param {*} finalX: x position of the final book (including rectWidth)
 * @param {*} height: width of the line for the shelf
 * @param {*} clr: color of the line of the shelf
 * @param {*} offset: offset around the bookshelf
 */
export function drawShelfLine(
  svg,
  initialX,
  initialY,
  finalX,
  height,
  clr,
  offset
) {
  svg
    .append("rect")
    .attr("x", initialX - offset)
    .attr("y", initialY)
    .attr("width", finalX - initialX + offset * 2)
    .attr("height", height)
    .attr("fill", clr);
}

/**
 *
 * @param {*} svg
 * @param {*} label
 * @param {*} xPosition
 * @param {*} yPosision
 */
export function drawLabel(
  svg,
  label,
  shelfInitialX,
  shelfY,
  shelfFinalX,
  fontSize
) {
  var txtWidth = getTextWidth(label, fontSize);

  var xpos = shelfInitialX + (shelfFinalX - shelfInitialX) / 2 - txtWidth / 2;

  svg
    .append("text")
    .text(label)
    .attr("fill", "black")
    .attr("font-size", "14px")
    .attr("x", xpos)
    .attr("y", shelfY);
}
