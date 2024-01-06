import { drawLine } from "./drawLine.js";
import { displayRating, getScaledStarDimensions } from "./displayRating.js";
import { glassmorphismFilter } from "./glassmorphismFilter.js";

const data = await d3.csv("./assets/dataset.csv");
const maxLength = Math.max(...data.map(d => Number(d.Length)));
const minLength = Math.min(...data.map(d => Number(d.Length)));
const maxRating = Math.max(...data.map(d => Number(d.Rating)));
const minRating = Math.min(...data.map(d => Number(d.Rating)));
const maxRectHeight = 100;
const minRectHeight = 40;
const maxRectWidth = 40;
const minRectWidth = 10;
const margin = 8; 
const colHeight = 145; 
const lightGrey = "#D9D9D9";
const mediumGrey = "#8C8C8C";
const redColor = "#700A18"; 
const greyColor = "#363636"; 
const yellowColor = "#B77A01"; 
const greenColor = "#6C8136"; 
const blueColor = "#132762"; 
const pinkColor = "#8A4252"; 
const goldenColor = yellowColor;

// EMOTIONS CATEGORIES
const negativeEmotions = { attributes: ["Outrage", "Fear", "Repulsion"], color:redColor};
const inBetweenEmotions = { attributes: ["Indifference", "Apprehension", "Confusion"], color:greyColor};
const hookedOntoEmotions = { attributes: ["Amusement", "Excitement"], color:yellowColor};
const unxpectedEmotions = { attributes: ["Wonder", "Surprise", "Anticipation"], color:greenColor};
const sadEmotions = { attributes: ["Despair", "Loss"], color:blueColor}; 
const relatableEmotions = { attributes: ["Nostalgia", "Amorous", "Relief"], color:pinkColor};

const emotions = [negativeEmotions, inBetweenEmotions, hookedOntoEmotions, unxpectedEmotions, sadEmotions, relatableEmotions];
const emotionColorMap = {};
mapAttrColor(emotions, emotionColorMap); 

// GENRE CATEGORIES
const fantasy = {attributes: ["Fantasy", "Urban Fantasy"], color: redColor}; 
const thriller = {attributes: ["Mystery", "Crime"], color: greyColor}; 
const dys = {attributes: ["Dystopia", "Thriller", "Adventure"], color:yellowColor}; 
const ancient = {attributes: ["Mythology", "Retellings", "Historical Fiction"], color: greenColor}; 
const misc = {attributes: ["Non-Fiction"], color: blueColor}; 
const romance = {attributes: ["Romance", "Chick Lit", "Contemporary"], color: pinkColor}; 

const genres = [fantasy, thriller, dys, romance, misc, ancient];
const genreColorMap = {}; 
mapAttrColor(genres, genreColorMap); 

// DATA PROCESSING
// groupedByYear contains books separated by the year i read them
const groupedByYear = data.reduce((acc, d) => {
  const year = d['Year_Read'];
  if (!acc[year]) {
    acc[year] = [];
  }
  acc[year].push(d);
  return acc;
}, {});

const yearKeys = Object.keys(groupedByYear);

// HELPER FUNCTIONS
const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
  ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

function mapAttrColor(inputArr, outputObj){
  inputArr.forEach(group => {
    group.attributes.forEach(attr => {
      outputObj[attr] = group.color;
    });
  });
  return outputObj; 
}

function calculateHiddenRectX(originalX, width, svgWidth, rectWidth) {
  const overflowRight = originalX + width + width / 3 + rectWidth > svgWidth - 5;
  return overflowRight ? originalX - rectWidth : originalX + width;
}

function calculateHiddenRectY(originalY, height, svgHeight, rectHeight) {
  const overflowBottom = originalY + rectHeight / 2 + height / 2 > svgHeight - 5;
  const overflowTop = originalY - rectHeight / 2 < 0;

  if (overflowBottom) {
    return originalY - rectHeight + height;
  } else if (overflowTop) {
    return originalY;
  } else {
    return originalY - rectHeight / 2 + height / 2;
  }
}

// Function to measure text width (you may need to adjust this based on your environment)
function getTextWidth(text, fontSize) {
  const font = fontSize + 'px Karla'; // Construct the font string
  // Create a temporary canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function wrapText(group, text, rectWidth, x, y, lineHeight, fontSize, fontStyle, color) {
  const words = text.split(/\s+/);
  let line = '';
  let lineNumber = 0;

  words.forEach((word, index) => {
    const testLine = line + word + " ";
    const testWidth = getTextWidth(testLine, fontSize); // Example font, adjust as needed

    if (testWidth > rectWidth && index > 0) {
      group.append('text')
        .attr('x', x)
        .attr('y', y + (lineNumber * lineHeight))
        .text(line)
        .attr('fill', color)
        .attr('font-size', fontSize)
        .attr('dominant-baseline', 'hanging')
        .style('font-style', fontStyle); 

      line = word + " ";
      lineNumber++;
    } else {
      line = testLine;
    }
  });
  let finalLineY = y + (lineNumber * lineHeight); 
  group.append('text') // Add the last line
    .attr('x', x)
    .attr('y', finalLineY)
    .text(line)
    .attr('fill', color)
    .attr('font-size', fontSize)
    .attr('dominant-baseline', 'hanging')
    .style('font-style', fontStyle); 
  
  return finalLineY; 
}

// shifts the book to the right to show it's being hovered on
function moveObjectOnMouseOver(svg, svgWidth, svgHeight, dataPoint) {
  const book = d3.select(this);
  let hiddenRectWidth = 250;
  let hiddenRectHeight = 150;
  let imgWidth = 80;
  let hiddenRectX = calculateHiddenRectX(this.originalX, this.width, svgWidth, hiddenRectWidth);
  let hiddenRectY = calculateHiddenRectY(this.originalY, this.height, svgHeight, hiddenRectHeight);
  let textContainerWidth = hiddenRectWidth - imgWidth - 4 * margin; 
  let textContainerX = hiddenRectX + margin * 3 + imgWidth; 
  let textContainerY = hiddenRectY + margin + 1; 
  let titleFontSize = 13; 
  let bodyFontSize = 10; 
  let lineSpacing = 13; 

  this.hiddenRect = svg.append('g');

  this.hiddenRect.append('rect')
    .attr('x', hiddenRectX)
    .attr('y', hiddenRectY)
    .attr('width', hiddenRectWidth)
    .attr('height', hiddenRectHeight)
    .style("fill", 'rgb(255, 255, 255)')
    .style("fill-opacity", '0.7')
    .style("stroke", 'rgb(255, 255, 255)')
    .style("stroke-opacity", '0.7')
    .style("mix-blend-mode", "luminosity")
    .style("stroke-width", 0.5)
    .attr("filter", "url(#drop-shadow)")
    .attr("rx", 5)
    .attr("ry", 5);

  this.hiddenRect.append('rect')
    .attr('x', hiddenRectX + margin)
    .attr('y', hiddenRectY + margin)
    .attr('height', hiddenRectHeight - margin * 2)
    .attr('width', imgWidth)
    .style('fill', lightGrey);
  
  let prevLineY = textContainerY; 
  if(dataPoint.Series != ""){
    prevLineY = wrapText(this.hiddenRect, dataPoint.Series, textContainerWidth, textContainerX, textContainerY, lineSpacing, bodyFontSize, 'italic', mediumGrey) + lineSpacing;
  }
  prevLineY = wrapText(this.hiddenRect, dataPoint.Book, textContainerWidth, textContainerX, prevLineY, lineSpacing, titleFontSize, 'normal', 'black') + lineSpacing + 1;

  prevLineY = wrapText(this.hiddenRect, 'by ' + dataPoint.Author, textContainerWidth, textContainerX, prevLineY, lineSpacing, bodyFontSize, 'normal', 'black') + lineSpacing + 4;

  const ratingX = displayRating(this.hiddenRect, dataPoint.Rating, textContainerX, prevLineY, goldenColor);
  prevLineY += getScaledStarDimensions()[1]/1.5 + lineSpacing;

  prevLineY = wrapText(this.hiddenRect, dataPoint.Length + ' pages', textContainerWidth, textContainerX, prevLineY, lineSpacing, bodyFontSize, 'normal', mediumGrey) + lineSpacing + 4;

  prevLineY = wrapText(this.hiddenRect, dataPoint.Genres, textContainerWidth, textContainerX, prevLineY, lineSpacing -1, bodyFontSize, 'normal', 'black') + lineSpacing + 4;

  prevLineY = wrapText(this.hiddenRect, dataPoint.Emotion, textContainerWidth, textContainerX, prevLineY, lineSpacing, bodyFontSize, 'normal', this.rectColor) + lineSpacing + 4;

  prevLineY = wrapText(this.hiddenRect, 'Published: ' + dataPoint.Year_Published + '; Read: ' + dataPoint.Year_Read, textContainerWidth, textContainerX, prevLineY, lineSpacing, bodyFontSize, 'normal', mediumGrey) + lineSpacing;
  
  // prevLineY += starHeight + lineSpacing

  if(prevLineY > hiddenRectY + hiddenRectHeight){
    let newRectHeight = prevLineY - hiddenRectY + 2 * margin;

    this.hiddenRect.select('rect')
      .attr('height', newRectHeight);
  }

  book.transition()
    .attr('transform', 'translate(0, ' + (-this.height / 4) + ')');

  this.hiddenRect.transition()
    .attr('transform', 'translate(0, ' + (-this.height / 4) + ')')
    .style("visibility", "visible");

}

// returns the book to the original position on mouse out
function returnObjectOnMouseOut() {
  const book = d3.select(this);
  book.transition()
    .attr('transform', 'translate(0, 0)');
  this.hiddenRect.transition()
    .attr('transform', 'translate(0, 0)')
    .style("visibility", "hidden");
}

function createVisualization(chosenSort, chosenSortAttr){
  d3.select('#parentDiv').select('svg').remove();

  // creating visualization
  const width = parentDiv.clientWidth; 
  const height = colHeight * yearKeys.length + margin; 

  // VISUALIZATION
  const svg = d3.select('#parentDiv').append('svg')
    .attr('width', width)
    .attr('height', height);

  const filterId = glassmorphismFilter(svg, lightGrey); 

  const books = {};

  // creating stacks
  let yOffset = maxRectHeight; 
  let xOffset = 0; 
  yearKeys.forEach(year => {
    const yearData = groupedByYear[year];
    const groupHeight = colHeight; 
    yearData.forEach((d, i) => {
      const rectWidth = mapNumRange(d.Length, minLength, maxLength, minRectWidth, maxRectWidth);
      const rectHeight = mapNumRange(d.Rating, minRating, maxRating, minRectHeight, maxRectHeight);
      const rectX = xOffset + colHeight/3;
      const rectY = yOffset - rectHeight;
      var rectColor; 
      switch(chosenSort){
        case emotions:
            console.log("chosenSort is emotions")
          var rectColor = chosenSortAttr[d.Emotion];
          break; 
        case genres:
          var rectColor = chosenSortAttr[d.Prominent_Genre]; 
          break; 
      } 
      const bookGroup = svg.append('g');
      books.bookGroup = null;

      bookGroup
        .each(function (d) {
          this.originalX = rectX;
          this.originalY = rectY;
          this.height = rectHeight;
          this.width = rectWidth;
          this.color = rectColor;
          this.hiddenRect = null;
          this.d = d;
          this.rectColor = rectColor; 
        });

      bookGroup.append('rect')
        .attr('x', rectX)
        .attr('y', rectY)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', rectColor)
        .attr('rx', 2.5)
        .attr('ry', 2.5)

      drawLine(bookGroup, lightGrey);

      bookGroup
        .on('mouseover', function () { moveObjectOnMouseOver.call(this, svg, width, height, d); })
        .on('mouseout', returnObjectOnMouseOut)
        .attr('cursor', 'pointer');

      xOffset += rectWidth 
    });

    svg.append('rect')
      .attr('x', colHeight/3 - 7.5)
      .attr('y', yOffset)
      .attr('width', xOffset+ 15)
      .attr('height', 3)
      .attr('fill', 'black')

    svg.append('text')
      .text(year)
      .attr('fill', 'black')
      .attr('font-size', '14px')
      .attr('x', xOffset)
      .attr('y', yOffset + 20)

    if(xOffset > width){
      yOffset += groupHeight; 
      xOffset = 0;
    }
    else{
      xOffset += 50; 
    }

    // yOffset += groupHeight; 
  });
}

// LEGEND 
function createLegend(chosenSort){
  d3.select('#legend-container').select('svg').remove();
  const legendWidth = 240 + 2 * margin; 
  const legendHeight = chosenSort.length * 20 + 5 * margin + 2; 

  const legendContainer = d3.select("#legend-container")
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("viewBox", `0 0 ${legendWidth} ${legendHeight}`);

  const legend = legendContainer.append("g")
    .attr('class', 'legend'); 

  legend.append("rect")
    .attr("x", 0) 
    .attr("y", 0.5) 
    .attr("width", legendWidth)
    .attr("height", legendHeight -1)
    .attr("fill", "#F9F6EE") 
    .attr("stroke", "black") 
    .attr("stroke-width", 0.5); 

  legend.append("text")
    .attr('x', 2*margin) 
    .attr('y', 3*margin) 
    .attr('fill', 'black')
    .attr('font-size', '14px')
    .attr('dominant-baseline', 'top')
    .text("Color by ");

  chosenSort.forEach((item, index) => {
    legend.append("rect")
      .attr("x", 2*margin)
      .attr("y", 5*margin + index * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", item.color);

    legend.append("text")
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .attr('dominant-baseline', 'hanging')
      .attr("x", 4*margin)
      .attr("y", 5*margin + index * 20)
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
