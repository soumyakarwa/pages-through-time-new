// COLORS
export const lightGrey = "#D9D9D9";
export const mediumGrey = "#8C8C8C";
export const redColor = "#700A18";
export const greyColor = "#363636";
export const yellowColor = "#B77A01";
export const greenColor = "#6C8136";
export const blueColor = "#132762";
export const pinkColor = "#8A4252";
export const goldenColor = yellowColor;

export const margin = 8;

export const data = await d3.csv("./assets/dataset.csv");
export const maxLength = Math.max(...data.map((d) => Number(d.Length)));
export const minLength = Math.min(...data.map((d) => Number(d.Length)));
export const maxRating = Math.max(...data.map((d) => Number(d.Rating)));
export const minRating = Math.min(...data.map((d) => Number(d.Rating)));

export const maxRectHeight = 100;
export const minRectHeight = 40;

export const maxRectWidth = 40;
export const minRectWidth = 10;

export const colHeight = 145;
