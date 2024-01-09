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

export const colHeight = margin * 19;

// EMOTIONS CATEGORIES
// const negativeEmotions = {
//   attributes: ["Outrage", "Fear", "Repulsion"],
//   color: redColor,
// };
// const inBetweenEmotions = {
//   attributes: ["Indifference", "Apprehension", "Confusion"],
//   color: greyColor,
// };
// const hookedOntoEmotions = {
//   attributes: ["Amusement", "Excitement"],
//   color: yellowColor,
// };
// const unxpectedEmotions = {
//   attributes: ["Wonder", "Surprise", "Anticipation"],
//   color: greenColor,
// };
// const sadEmotions = {
//   attributes: ["Despair", "Loss"],
//   color: blueColor,
// };
// const relatableEmotions = {
//   attributes: ["Nostalgia", "Amorous", "Relief"],
//   color: pinkColor,
// };

// export const emotions = [
//   negativeEmotions,
//   inBetweenEmotions,
//   hookedOntoEmotions,
//   unxpectedEmotions,
//   sadEmotions,
//   relatableEmotions,
// ];

// GENRE CATEGORIES
const fantasy = {
  attributes: ["Fantasy", "Urban Fantasy"],
  color: redColor,
};
const thriller = {
  attributes: ["Mystery", "Crime"],
  color: greyColor,
};
const dys = {
  attributes: ["Dystopia", "Thriller", "Adventure"],
  color: yellowColor,
};
const ancient = {
  attributes: ["Mythology", "Retellings", "Historical Fiction"],
  color: greenColor,
};
const misc = { attributes: ["Non-Fiction"], color: blueColor };
const romance = {
  attributes: ["Romance", "Chick Lit", "Contemporary"],
  color: pinkColor,
};

export const genres = [fantasy, thriller, dys, romance, misc, ancient];

export const books = {};
