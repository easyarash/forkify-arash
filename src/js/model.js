import { async } from "regenerator-runtime";
import { API_URL, SEARCH_RES_PER_PAGE, KEY } from "./config.js";
import { ajax } from "./helpers.js";
export const state = {
  recipe: {},
  serach: {
    query: "",
    results: [],
    page: 1,
    resultPerPage: SEARCH_RES_PER_PAGE,
  },
  bookMarks: [],
};
const createObjectRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await ajax(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createObjectRecipe(data);
    if (state.bookMarks.some((b) => b.id === id)) {
      state.recipe.bookMarked = true;
    } else state.recipe.bookMarked = false;
  } catch (error) {
    throw error;
  }
};
export const loadSearchResult = async function (query) {
  try {
    state.serach.query = query;
    const data = await ajax(`${API_URL}?search=${query}&key=${KEY}`);
    state.serach.page = 1;
    state.serach.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchResultPage = function (page = state.serach.page) {
  state.serach.page = page;
  const start = (page - 1) * state.serach.resultPerPage;
  const end = page * state.serach.resultPerPage;

  return state.serach.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const presistBookMarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookMarks));
};

export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;

  presistBookMarks();
};

export const deleteBookMarks = function (id) {
  const index = state.bookMarks.findIndex((el) => el.id === id);
  state.bookMarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookMarked = false;

  presistBookMarks();
};
// loadSearchResult("pizza");
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookMarks = JSON.parse(storage);
};
init();
// console.log(state.bookMarks);
const clearBookMarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookMarks()

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        // const ingArr = ing[1].split(",").map((el) => el.trim());
        const ingArr = ing[1].replaceAll(" ", "").split(",");
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient fromat! Please use the correct format :)"
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await ajax(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createObjectRecipe(data);

    addBookMark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
