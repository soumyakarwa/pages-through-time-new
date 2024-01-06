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
            .attr('x1', originalX + width / 9)
            .attr('y1', originalY)
            .attr('x2', originalX + width / 9)
            .attr('y2', originalY + height)
            .attr('stroke', lineColor)
            .attr('stroke-width', 0.5);
  
          groupElement.append('line')
            .attr('x1', originalX + width / 9 + 3)
            .attr('y1', originalY)
            .attr('x2', originalX + width / 9 + 3)
            .attr('y2', originalY + height)
            .attr('stroke', lineColor)
            .attr('stroke-width', 0.5);
  
          groupElement.append('line')
            .attr('x1', originalX + width - width / 9 - 3)
            .attr('y1', originalY)
            .attr('x2', originalX + width - width / 9 - 3)
            .attr('y2', originalY + height)
            .attr('stroke', lineColor)
            .attr('stroke-width', 0.5);
  
          groupElement.append('line')
            .attr('x1', originalX + width - width / 9 - 6)
            .attr('y1', originalY)
            .attr('x2', originalX + width - width / 9 - 6)
            .attr('y2', originalY + height)
            .attr('stroke', lineColor)
            .attr('stroke-width', 0.5);
  
          break;
        case 2:
          groupElement.append('line')
            .attr('x1', originalX + width / 10)
            .attr('y1', originalY)
            .attr('x2', originalX + width / 10)
            .attr('y2', originalY + height)
            .attr('stroke', lineColor)
            .attr('stroke-width', 2);
          break;
      }
    });
  }