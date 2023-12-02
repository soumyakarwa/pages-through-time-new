// parsing data
const data = await d3.csv("./assets/dataset.csv"); 
const maxLength = Math.max(...data.map(d => Number(d.Length)));
const minLength = Math.min(...data.map(d => Number(d.Length)));
const maxRating = Math.max(...data.map(d => Number(d.Rating)));
const minRating = Math.min(...data.map(d => Number(d.Rating)));
// const uniqueEmotions = Array.from(new Set(data.map(d => d.Emotion)));
const maxRectHeight = 80; 
const minRectHeight = 50;
const maxRectWidth = 40;
const minRectWidth = 10;

const colWidth = 120; 
// const shiftAmount = 15;

const negativeEmotions = {emotions:["Outrage", "Fear", "Repulsion"], color:"#900E00"}
const inBetweenEmotions = {emotions:["Indifference", "Apprehension", "Confusion"], color:"#3D3D3D"}; 
const hookedOntoEmotions = {emotions:["Amusement", "Excitement"], color:"#7F6293"};
const unxpectedEmotions = {emotions:["Wonder", "Surprise", "Anticipation"], color:"#227F10"};
const sadEmotions = {emotions:["Despair", "Loss"], color:"#338399"};
const relatableEmotions = {emotions:["Nostalgia", "Amorous", "Relief"], color:"#F6CBD6"};
const greyLines = "#D9D9D9"; 

const emotions = [negativeEmotions, inBetweenEmotions, hookedOntoEmotions, unxpectedEmotions, sadEmotions, relatableEmotions]; 

const emotionColorMap = {};
emotions.forEach(group => {
    group.emotions.forEach(emotion => {
        emotionColorMap[emotion] = group.color;
    });
});

// HELPER FUNCTIONS
const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
  ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

// shifts the book to the right to show it's being hovered on
function moveObjectOnMouseOver() {
  const book = d3.select(this);
  book.transition()
      .attr('transform', 'translate(' + this.width/3 + ', 0)'); 
  this.hiddenRect.style("visibility", "visible");
}

// returns the book to the original position on mouse out
function returnObjectOnMouseOut() {
  const book = d3.select(this);
  book.transition()
      .attr('transform', 'translate(0, 0)');
  this.hiddenRect.style("visibility", "hidden");
}

// DETERMINING WHAT LINES TO DRAW ON THE BOOK
function drawLine(book) {
  let combination = Math.floor(Math.random() * 3);

  book.each(function() {
    // Access the properties of the DOM element
    const groupElement = d3.select(this);
    const originalX = this.originalX;
    const originalY = this.originalY;
    const width = this.width;
    const height = this.height;
    const lineColor = this.color == "#F6CBD6" ? "#BFBFBF" : greyLines; 


    switch (combination) {
      case 0:
        groupElement.append('line')
            .attr('x1', originalX + 1)
            .attr('y1', originalY + 3)
            .attr('x2', originalX + width - 1)
            .attr('y2', originalY + 3)
            .attr('stroke', lineColor)
            .attr('stroke-width', 0.5);
        
        groupElement.append('line')
            .attr('x1', originalX + 1)
            .attr('y1', originalY + height - 3)
            .attr('x2', originalX + width - 1)
            .attr('y2', originalY + height - 3)
            .attr('stroke', lineColor)
            .attr('stroke-width', 0.5);
        break;
      case 1:
        groupElement.append('line')
          .attr('x1', originalX + width/9)
          .attr('y1', originalY)
          .attr('x2', originalX + width/9)
          .attr('y2', originalY + height)
          .attr('stroke', lineColor)
          .attr('stroke-width', 0.5);

        groupElement.append('line')
          .attr('x1', originalX + width/9 + 3)
          .attr('y1', originalY)
          .attr('x2', originalX + width/9 + 3)
          .attr('y2', originalY + height)
          .attr('stroke', lineColor)
          .attr('stroke-width', 0.5);
        
        groupElement.append('line')
          .attr('x1', originalX + width - width/9 - 3)
          .attr('y1', originalY)
          .attr('x2',originalX + width - width/9 - 3)
          .attr('y2', originalY + height)
          .attr('stroke', lineColor)
          .attr('stroke-width', 0.5);
        
        groupElement.append('line')
          .attr('x1', originalX + width - width/9 - 6)
          .attr('y1', originalY)
          .attr('x2',originalX + width - width/9 - 6)
          .attr('y2', originalY + height)
          .attr('stroke', lineColor)
          .attr('stroke-width', 0.5);

        break;
      case 2:
        groupElement.append('line')
          .attr('x1', originalX + width/10)
          .attr('y1', originalY)
          .attr('x2', originalX + width/10)
          .attr('y2', originalY + height)
          .attr('stroke', lineColor)
          .attr('stroke-width', 2);
      break; 
    }
  });
}

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

// creating visualization
const width = colWidth*yearKeys.length;
const height = parentDiv.clientHeight;

// each datapoint will be represented by a rectangle. the color of the rectangle will be determined by the emotion i felt while reading the book. the height of the rectangle will be determined by the rating of the book. the width of the rectangle will be determined by it's length. 

// VISUALIZATION
const svg = d3.select('#parentDiv').append('svg')
.attr('width', width)
.attr('height', height);

// glassmorphism filter
const defs = svg.append("defs");
const filter = defs.append("filter")
  .attr("id", "drop-shadow")
  .attr("height", "130%");

filter.append("feGaussianBlur")
  .attr("in", "SourceAlpha")
  .attr("stdDeviation", 5)
  .attr("result", "blur");

filter.append("feOffset")
  .attr("in", "blur")
  .attr("dx", 0)
  .attr("dy", 8)
  .attr("result", "offsetBlur");

filter.append("feFlood")
  .attr("flood-color", greyLines)
  .attr('floop-opacity', '0.9')
  .attr("result", "color");

filter.append("feComposite")
  .attr("in", "color")
  .attr("in2", "offsetBlur")
  .attr("operator", "in")
  .attr("result", "shadow");

filter.append("feMerge").selectAll("feMergeNode")
  .data(["shadow", "SourceGraphic"])
  .enter().append("feMergeNode")
  .attr("in", String);

let xOffset = 0;
yearKeys.forEach(year => {
    const yearData = groupedByYear[year];
    const groupWidth = colWidth; 
    let yOffset = height - 20;

    svg.append('text')
      .text(year)
      .attr('fill', 'black') 
      .attr('font-size', '12px')
      .attr('dominant-baseline', 'top')
      .attr('x', xOffset + groupWidth/2 - colWidth/8)
      .attr('y', height); 
      
    yearData.forEach((d, i) => {
      const rectHeight = mapNumRange(d.Length, minLength, maxLength, minRectWidth, maxRectWidth);
      const rectWidth = mapNumRange(d.Rating, minRating, maxRating, minRectHeight, maxRectHeight);
      const rectX =  xOffset + colWidth/2 - rectWidth/2; 
      const rectY = yOffset - rectHeight; 
      const emotionColor = emotionColorMap[d.Emotion]; 
      const bookGroup = svg.append('g'); 
      
      const hiddenRect = bookGroup.append('rect')
        .attr('x', rectX + rectWidth)
        .attr('y', rectY)
        .attr('width', 200)
        .attr('height', 150)
        .style("fill", 'rgb(255, 255,255)')
        .style("fill-opacity", '0.5')
        // .interpolate('colors', "['rgb(255, 255, 255)', greyLines]")
        .style("stroke", 'rgb(255, 255,255)')
        .style("stroke-opacity", '0.5')
        .style("mix-blend-mode", "luminosity")
        .style("stroke-width", 0.5)
        .attr("filter", "url(#drop-shadow)")
        .attr("rx", 5)
        .attr("ry", 5)
        .style("visibility", "hidden");

      bookGroup 
        .each(function() {
            this.originalX = rectX;
            this.originalY = rectY; 
            this.height = rectHeight; 
            this.width = rectWidth; 
            this.color = emotionColor; 
            this.hiddenRect = hiddenRect; 
        });

      bookGroup.append('rect')
        .attr('x', rectX)
        .attr('y', rectY)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', emotionColor)
        .attr('rx', 2.5)
        .attr('ry', 2.5)
      
      drawLine(bookGroup);
          
      bookGroup
        .on('mouseover', moveObjectOnMouseOver)
        .on('mouseout', returnObjectOnMouseOut)
        .attr('cursor', 'pointer'); 

      yOffset -= rectHeight; 
    });
  
    xOffset += groupWidth; 
  });

  // LEGEND 
  const legend = svg.append("g")
    .attr('class', 'legend')
    .attr('transform', 'translate(30, 0)'); 

  legend.append("text")
    .attr('x', 0) 
    .attr('y', 10) 
    .attr('fill', 'black') 
    .attr('font-size', '14px')
    .attr('dominant-baseline', 'top')
    .text("I felt ...");

  emotions.forEach((item, index) => {
      // Append a rectangle for each item
      legend.append("rect")
        .attr("x", 0)
        .attr("y", 30 + index * 20) 
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", item.color);

      legend.append("text")
        .attr('fill', 'black') 
        .attr('font-size', '12px')
        .attr('dominant-baseline', 'top')
        .attr("x", 20) 
        .attr("y", 30 + index * 20 + 8)
        .text(item.emotions.join(", "));
  });

  // SVG BORDERS 
  svg.append('ellipse')
   .attr('cx', 0) 
   .attr('cy', height) // Centers the ellipse vertically
   .attr('rx', 5) // Example radius along the x-axis
   .attr('ry', 5) // Example radius along the y-axis
   .attr('fill', "#900E00");
 
  svg.append('ellipse')
   .attr('cx', width) 
   .attr('cy', height) // Centers the ellipse vertically
   .attr('rx', 5) // Example radius along the x-axis
   .attr('ry', 5) // Example radius along the y-axis
   .attr('fill', "#900E00");

  svg.append('ellipse')
   .attr('cx', width) 
   .attr('cy', 0) // Centers the ellipse vertically
   .attr('rx', 5) // Example radius along the x-axis
   .attr('ry', 5) // Example radius along the y-axis
   .attr('fill', "#900E00");

  svg.append('ellipse')
   .attr('cx', 0) 
   .attr('cy', 0) // Centers the ellipse vertically
   .attr('rx', 5) // Example radius along the x-axis
   .attr('ry', 5) // Example radius along the y-axis
   .attr('fill', "#900E00");
