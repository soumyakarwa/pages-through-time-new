/**
 * This function extrapolates a number in a certain range to another range.
 * @param {*} num: number
 * @param {*} inMin: existing minimum
 * @param {*} inMax: existing maximum
 * @param {*} outMin: intended minimum
 * @param {*} outMax: intended maximum
 */
export function mapNumRange(num, inMin, inMax, outMin, outMax) {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * This function maps colors to categories
 * @param {*} inputArr: All the categories of a list
 * @param {*} outputObj: Object that contains the category with the associated color
 * @returns
 */
export function mapAttrColor(inputArr, outputObj) {
  inputArr.forEach((group) => {
    group.attributes.forEach((attr) => {
      outputObj[attr] = group.color;
    });
  });
  return outputObj;
}

/**
 *
 * @param {*} originalX: Book X Position
 * @param {*} width: Book Width
 * @param {*} svgWidth: SVG Width
 * @param {*} rectWidth: Card Width
 * @returns X position of the Card accounting for all the above parameters
 */
export function calculateHiddenRectX(originalX, width, svgWidth, rectWidth) {
  const overflowRight =
    originalX + width + width / 3 + rectWidth > svgWidth - 5;
  return overflowRight ? originalX - rectWidth : originalX + width;
}

/**
 *
 * @param {*} originalY: Book Y Position
 * @param {*} height: Book Height
 * @param {*} svgHeight: SVG Height
 * @param {*} rectHeight: Card Height
 * @returns Y position of the Card accounting for all the above parameters
 */
export function calculateHiddenRectY(originalY, height, svgHeight, rectHeight) {
  const overflowBottom =
    originalY + rectHeight / 2 + height / 2 > svgHeight - 5;
  const overflowTop = originalY - rectHeight / 2 < 0;

  if (overflowBottom) {
    return originalY - rectHeight + height;
  } else if (overflowTop) {
    return originalY;
  } else {
    return originalY - rectHeight / 2 + height / 2;
  }
}

/**
 *
 * @param {*} text
 * @param {*} fontSize
 * @returns text width
 */
function getTextWidth(text, fontSize) {
  const font = fontSize + "px Karla"; // Construct the font string
  // Create a temporary canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

/**
 * Wraps text in case text is moving out of the glassmorphic card
 * @param {*} group
 * @param {*} text
 * @param {*} rectWidth: Card Width
 * @param {*} x
 * @param {*} y
 * @param {*} lineHeight
 * @param {*} fontSize
 * @param {*} fontStyle
 * @param {*} color
 * @returns
 */
export function wrapText(
  group,
  text,
  rectWidth,
  x,
  y,
  lineHeight,
  fontSize,
  fontStyle,
  color
) {
  const words = text.split(/\s+/);
  let line = "";
  let lineNumber = 0;

  words.forEach((word, index) => {
    const testLine = line + word + " ";
    const testWidth = getTextWidth(testLine, fontSize); // Example font, adjust as needed

    if (testWidth > rectWidth && index > 0) {
      group
        .append("text")
        .attr("x", x)
        .attr("y", y + lineNumber * lineHeight)
        .text(line)
        .attr("fill", color)
        .attr("font-size", fontSize)
        .attr("dominant-baseline", "hanging")
        .style("font-style", fontStyle);

      line = word + " ";
      lineNumber++;
    } else {
      line = testLine;
    }
  });
  let finalLineY = y + lineNumber * lineHeight;
  group
    .append("text") // Add the last line
    .attr("x", x)
    .attr("y", finalLineY)
    .text(line)
    .attr("fill", color)
    .attr("font-size", fontSize)
    .attr("dominant-baseline", "hanging")
    .style("font-style", fontStyle);

  return finalLineY;
}
