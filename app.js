// parsing data
const data = await d3.csv("./assets/dataset.csv"); 

// groupedByYear contains books separated by the year i read them
const groupedByYear = data.reduce((acc, d) => {
    const year = d['Year_Read'];
    if (!acc[year]) {
        acc[year] = [];
    }
    acc[year].push(d);
    return acc;
}, {});

// each datapoint will be represented by a rectangle. the color of the rectangle will be determined by the emotion i felt while reading the book. the height of the rectangle will be determined by the rating of the book. the width of the rectangle will be determined by it's length. 

// hovering on each rectangle will reveal a small card that contains the other properties of the book including name, genre, author, rating


// creating visualization
const parentDiv = document.getElementById("parentDiv");
const svg = d3.select(parentDiv).append("svg");

const width = parentDiv.clientWidth;
const height = parentDiv.clientHeight;

