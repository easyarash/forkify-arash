import View from "./view.js";

class ResultsView extends View {
  _parentEl = document.querySelector(".results");
  _erroMessage = "No query were found. Try again :)";
  _successMessage = "";

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join("");
  }

  _generateMarkupPreview(resluts) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
        <a class="preview__link ${
          resluts.id === id ? "preview__link--active" : ""
        }" href="#${resluts.id}">
            <figure class="preview__fig">
                <img src="${resluts.image}" alt="Test" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${resluts.title} ...</h4>
                <p class="preview__publisher">${resluts.publisher}</p>
            </div>
        </a>
    </li>
    `;
  }
}

export default new ResultsView();
