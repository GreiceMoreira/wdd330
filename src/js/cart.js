import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  // Stabilizing the connection with HTML element `.product-list`
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Render the total price after rendering the cart contents
  renderTotalPrice(cartItems);

}

function cartItemTemplate(item) {
  const newItem = 
  `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}


//cardItems it is a array of items
// I need add to the total each final price 
//for each item that i have in my cartItems, take the Final price and add
//my total template, price and button

// Function to render the total price
function renderTotalPrice(cartItems) {
  const totalPrice = cartItems.reduce((total, item) => total + item.FinalPrice, 0); 
  const totalHtml = totalPriceTemplate(totalPrice); 
  document.querySelector(".total-price").innerHTML = totalHtml; 
}

// Function to generate the total price HTML
function totalPriceTemplate(totalPrice) {
  return `
    <p>Total: $${totalPrice.toFixed(2)}</p>
    <button id="checkout">Checkout</button>
  `;
}

renderCartContents();
