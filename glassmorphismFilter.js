/**
 * This function creates a glassmorphismFilter that is used as a design choice for 
 * the card that shows upon hovering on a certain book. 
 * @param {*} svg: adding the filter to the svg 
 * @param {*} clr: lightGrey
 * @returns 
 */
export function glassmorphismFilter(svg, clr){
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
    .attr("flood-color", clr)
    .attr('flood-opacity', '0.9')
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

    return "drop-shadow"; 
}

