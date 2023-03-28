import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addNewRecipeView from "./views/addNewRecipeView.js";

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.searchResultPage());

    bookmarksView.update(model.state.bookMarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};
// controlRecipe();

const controlResult = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResult(query);

    // resultsView.render(model.state.serach.results);
    resultsView.render(model.searchResultPage());

    paginationView.render(model.state.serach);
  } catch (error) {
    console.log(error);
  }
};

const controlPagClick = function (goTo) {
  resultsView.render(model.searchResultPage(goTo));
  paginationView.render(model.state.serach);
};

const controlServings = function (updateTo) {
  model.updateServings(updateTo);

  recipeView.update(model.state.recipe);
};

const controlBookMarks = function () {
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMarks(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookMarks);
};

const controlBookMarksSaving = function () {
  bookmarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addNewRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    addNewRecipeView.renderMessage();
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookMarks);
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
  } catch (error) {
    console.error(error);
    addNewRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addBookMarkHandler(controlBookMarksSaving);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookMark(controlBookMarks);
  searchView.addHandlerSearch(controlResult);
  paginationView.addHandlerClick(controlPagClick);
  addNewRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
