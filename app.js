const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
  ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

// parsing data
const data = await d3.csv("./assets/dataset.csv"); 

const maxLength = Math.max(...data.map(d => Number(d.Length)));
const minLength = Math.min(...data.map(d => Number(d.Length)));
const maxRating = Math.max(...data.map(d => Number(d.Rating)));
const minRating = Math.min(...data.map(d => Number(d.Rating)));
// const uniqueEmotions = Array.from(new Set(data.map(d => d.Emotion)));
const maxRectWidth = 50; 
const minRectWidth = 5;
const maxRectHeight = 100;
const minRectHeight = 10;

const negativeEmotions = {emotions:["Outrage", "Fear", "Repulsion"], color:"#900E00"}
const inBetweenEmotions = {emotions:["Indifference", "Apprehension", "Confusion"], color:"#3D3D3D"}; 
const hookedOntoEmotions = {emotions:["Amusement", "Excitement", "Anticipation"], color:"#7F6293"};
const unxpectedEmotions = {emotions:["Relief", "Wonder", "Surprise"], color:"#227F10"};
const sadEmotions = {emotions:["Despair", "Loss"], color:"#338399"};
const relatableEmotions = {emotions:["Nostalgia", "Amorous"], color:"#F6CBD6"};

const emotions = [negativeEmotions, inBetweenEmotions, hookedOntoEmotions, unxpectedEmotions, sadEmotions, relatableEmotions]; 


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


// creating visualization
const parentDiv = document.getElementById("parentDiv");
const width = parentDiv.clientWidth;
const height = parentDiv.clientHeight;

// each datapoint will be represented by a rectangle. the color of the rectangle will be determined by the emotion i felt while reading the book. the height of the rectangle will be determined by the rating of the book. the width of the rectangle will be determined by it's length. 

// Create SVG and set its dimensions
const svg = d3.select('#parentDiv').append('svg')
.attr('width', width)
.attr('height', height);


const yearKeys = Object.keys(groupedByYear);
let yOffset = 0;

yearKeys.forEach(year => {
    const yearData = groupedByYear[year];
    const groupHeight = 125; 
    let xOffset = 0; 

    yearData.forEach((d, i) => {
      const rectWidth = mapNumRange(d.Length, minLength, maxLength, minRectWidth, maxRectWidth);
      const emotionColor = emotionColorMap[d.Emotion]
  
      svg.append('rect')
        .attr('x', xOffset)  
        .attr('width', rectWidth)
        .attr('height', mapNumRange(d.Rating, minRating, maxRating, minRectHeight, maxRectHeight))
        .attr('y', yOffset + 25 - mapNumRange(d.Rating, minRating, maxRating, minRectHeight, maxRectHeight) / 2)
        .attr('fill', emotionColor);  
  
      xOffset += rectWidth;
    });
  
    yOffset += groupHeight;
  });
  


  