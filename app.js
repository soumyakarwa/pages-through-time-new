// parsing data
const data = await d3.csv("./assets/dataset.csv"); 
const maxLength = Math.max(...data.map(d => Number(d.Length)));
const minLength = Math.min(...data.map(d => Number(d.Length)));
const maxRating = Math.max(...data.map(d => Number(d.Rating)));
const minRating = Math.min(...data.map(d => Number(d.Rating)));
// const uniqueEmotions = Array.from(new Set(data.map(d => d.Emotion)));
const maxRectWidth = 40; 
const minRectWidth = 5;
const maxRectHeight = 80;
const minRectHeight = 10;

const colWidth = 115; 

const negativeEmotions = {emotions:["Outrage", "Fear", "Repulsion"], color:"#900E00"}
const inBetweenEmotions = {emotions:["Indifference", "Apprehension", "Confusion"], color:"#3D3D3D"}; 
const hookedOntoEmotions = {emotions:["Amusement", "Excitement", "Anticipation"], color:"#7F6293"};
const unxpectedEmotions = {emotions:["Wonder", "Surprise"], color:"#227F10"};
const sadEmotions = {emotions:["Despair", "Loss"], color:"#338399"};
const relatableEmotions = {emotions:["Nostalgia", "Amorous", "Relief"], color:"#F6CBD6"};

const emotions = [negativeEmotions, inBetweenEmotions, hookedOntoEmotions, unxpectedEmotions, sadEmotions, relatableEmotions]; 


const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
  ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

// groupedByYear contains books separated by the year i read them
const groupedByYear = data.reduce((acc, d) => {
    const year = d['Year_Read'];
    if (!acc[year]) {
        acc[year] = [];
    }
    acc[year].push(d);
    return acc;
}, {});

console.log(groupedByYear); 

const emotionColorMap = {};
emotions.forEach(group => {
    group.emotions.forEach(emotion => {
        emotionColorMap[emotion] = group.color;
    });
});

const yearKeys = Object.keys(groupedByYear);

// creating visualization
const parentDiv = document.getElementById("parentDiv");
// const width = parentDiv.clientWidth;
const width = colWidth*yearKeys.length;
const height = parentDiv.clientHeight;

// each datapoint will be represented by a rectangle. the color of the rectangle will be determined by the emotion i felt while reading the book. the height of the rectangle will be determined by the rating of the book. the width of the rectangle will be determined by it's length. 

// Create SVG and set its dimensions
const svg = d3.select('#parentDiv').append('svg')
.attr('width', width)
.attr('height', height);

console.log(groupedByYear); 


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
      console.log(d, rectHeight, yOffset);  
      const emotionColor = emotionColorMap[d.Emotion]; 
  
      svg.append('rect')
        .attr('x', xOffset + colWidth/2 - rectWidth/2 )
        .attr('y', yOffset - rectHeight)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', emotionColor); 
        
      yOffset -= rectHeight; 
    });
  
    xOffset += groupWidth; 
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


  