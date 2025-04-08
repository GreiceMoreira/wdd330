import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

// Function to render the cart contents
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  // Display a message if the cart is empty
  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty!</p>";
    document.querySelector(".list-footer.hide").innerHTML = "";
    return;
  }

  // Count the quantity of each item in the cart
  const itemCounts = cartItems.reduce((acc, item) => {
    if (acc[item.Id]) {
      acc[item.Id].quantity += 1;
    } else {
      acc[item.Id] = { ...item, quantity: 1 };
    }
    return acc;
  }, {});

  // Create HTML for each unique item with its quantity
  const htmlItems = Object.values(itemCounts).map(cartItemTemplate).join("");
  document.querySelector(".product-list").innerHTML = htmlItems;

  // Render the total price after rendering the cart contents
  renderTotalPrice(Object.values(itemCounts));
}

// Function to create the HTML template for each cart item
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity}</p> 
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button class="remove" data-id="${item.Id}">Remove item</button>
    <div id="remove-notification-${item.Id}" class="remove-notification" style="display: none;"></div>
  </li>`;
}

// Function to remove an item from the cart
function removeProductFromCart(itemId) {
  let cartItems = getLocalStorage("so-cart") || [];

  const itemIndex = cartItems.findIndex((item) => item.Id === itemId);

  if (itemIndex !== -1) {
    if (cartItems[itemIndex].quantity > 1) {
      cartItems[itemIndex].quantity -= 1;
    } else {
      cartItems.splice(itemIndex, 1);
    }
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

// Function to show the notification after removing an item
function showRemoveNotification(itemId) {
  const notification = document.getElementById(`remove-notification-${itemId}`);
  if (notification) {
    notification.style.display = "block";
    notification.innerHTML = "Product removed from the cart!";

    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }
}

// Add click event listener to the "Remove" buttons
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove")) {
      const itemId = event.target.getAttribute("data-id");
      removeProductFromCart(itemId);
      showRemoveNotification(itemId);
    }
  });
});

// Function to render the total price
function renderTotalPrice(cartItems) {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.FinalPrice * item.quantity,
    0,
  );

  document.querySelector(".list-footer.hide").innerHTML =
    totalPriceTemplate(totalPrice);
}

// Function to generate the total price HTML
function totalPriceTemplate(totalPrice) {
  return `
      <a href="/checkout/" class="checkout-button">Checkout</a>
      <span class="total-label">Total:</span>
      <span class="list-total">$${totalPrice.toFixed(2)}</span>`;
}

renderCartContents();
