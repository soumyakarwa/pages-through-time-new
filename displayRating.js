const fullPathData = "m775,305.4h-286.94L400,37.74l-88.06,267.66H25l234.7,164.69-91.41,267.66,231.7-165.88,231.7,165.88-91.58-267.66,234.88-164.69Z"; 
const halfStarPathData =  "m400,407.9V37.74l-88.06,267.66H25l234.7,164.69-91.41,267.66,231.7-165.88h0v-163.97Z"; 
const quarterStarPathData = "m311.94,305.4H25l234.7,164.69-91.41,267.66,231.7-165.88h0l-88.06-266.47h0Z"; 
const threeQuarterStarPathData = "m775,305.4h-286.94L400,37.74l-88.06,267.66H25l234.7,164.69-91.41,267.66,231.7-165.88,140.12-101.78h0l234.88-164.69Z"; 
const scaleFactor = 0.02;
const starHeight = 800; 
const starWidth = 800; 
const scaledStarWidth = starWidth * scaleFactor;
const scaledStarHeight = starHeight * scaleFactor; 

/**
 * 
 * @param {*} partialValue: if the book has a partial rating (.5, 0.25, 0.75)
 * @returns the svg path that links to the partial star i.e. 0.25, 0.5, 0.75
 */
function getPartialStarPath(partialValue) {
    // Return the path data based on the partial value
    if (partialValue === 0.25) {
      return quarterStarPathData; // Define this path data
    } else if (partialValue === 0.5) {
      return halfStarPathData; // Define this path data
    } else if (partialValue === 0.75) {
      return threeQuarterStarPathData; // Define this path data
    }
    return ""; // No partial star
}

/**
 * 
 * @returns adjusted dimensions for each svg star
 */
export function getScaledStarDimensions(){
    return [scaledStarWidth, scaledStarHeight]; 
}

/**
 * This fuction draws the book's rating on the glassmorphic card
 * @param {*} svgContainer 
 * @param {*} rating: the book's rating
 * @param {*} x: starting x position
 * @param {*} y: starting y position
 * @param {*} clr: color of the star
 * @returns the x position of the last star in the rating
 */
export function displayRating(svgContainer, rating, x, y, clr) {
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1; // This will be 0, 0.25, 0.5, or 0.75
    let currentX = x;
  
    // Append full stars
    for (let i = 0; i < fullStars; i++) {
      svgContainer.append('path') 
        .attr('d', fullPathData)
        .attr('transform', `translate(${currentX}, ${y}) scale(${scaleFactor})`)
        .style('fill', `${clr}`); 
      currentX += scaledStarWidth;
    }
  
    // Append partial star if needed
    if (partialStar > 0) {
      const partialPathData = getPartialStarPath(partialStar);
      svgContainer.append('path') 
      .attr('d', partialPathData)
      .attr('transform', `translate(${currentX}, ${y}) scale(${scaleFactor})`)
      .style('fill', `${clr}`); 
    }
  
    return currentX; 
  }