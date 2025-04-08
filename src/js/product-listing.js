import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

//Header and Footer
loadHeaderFooter();

const category = getParam("category");
const dataSource = new ExternalServices();

const listElement = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, listElement);

listing.init();
