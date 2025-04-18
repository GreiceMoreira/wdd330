//Purpose: generate a list of product cards in HTML from an array
import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `
      <li class="product-card">
        <a href="/product_pages/?products=${product.Id}">
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
          <h2>${product.Brand.Name}</h2>
          <h3>${product.Name}</h3>
          <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
      </li>
      `;
}
  
export default class ProductList {
    constructor(category, dataSource, listElement) {
      this.category = category;
      this.dataSource = dataSource;
      this.listElement = listElement;
    }
  
    async init() {
      const list = await this.dataSource.getData(this.category);
      this.renderList(list);
      document.querySelector(".title").textContent = this.getTitle(this.category);
    }
    
    getTitle(category) {
      const title = category.replace("-", " ");
      const firstLetter = title.charAt(0);
      const remainingLetters = title.slice(1);

      return firstLetter.toUpperCase() + remainingLetters;
      
    }

    renderList(list) {
      // const htmlStrings = list.map(productCardTemplate);
      // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
  
      // apply use new utility function instead of the commented code above
      renderListWithTemplate(productCardTemplate, this.listElement, list);
  
    }
  
  }