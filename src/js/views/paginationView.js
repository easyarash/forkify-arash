import icons from "url:../../img/icons.svg";
import View from "./view.js";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");
  addHandlerClick(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goToClickBtn = Number(btn.dataset.goto);
      console.log(goToClickBtn);
      handler(goToClickBtn);
    });
  }
  _generateMarkup() {
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    const curPage = this._data.page;

    console.log(numPage, curPage);
    if (curPage === 1 && numPage > 1)
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
    if (curPage === numPage && numPage > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>;
      `;
    }
    if (curPage < numPage) {
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>;
        `;
    }

    return "";
  }
}

export default new PaginationView();
