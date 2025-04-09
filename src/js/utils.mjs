// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const product = urlParams.get(param)
  return product
}


export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position,htmlStrings.join(""));
}


export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback){
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// loadHeaderFooter
// Load the header and footer templates in from the partials using the loadTemplate.
// Grab the header and footer placeholder elements out of the DOM.
// Render the header and footer using renderWithTemplate.

export async function loadHeaderFooter(){
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#main-header");

  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(footerTemplate, footerElement);
}
export function alertMessage(message, scroll=true) {
    // create element to hold the alert
    const alert = document.createElement('div');

    // add a class to style the alert
    alert.classList.add('alert');
    // set the contents. You should have a message and an X or something the user can click on to remove
    alert.innerHTML = `
    <span>${message}</span>
    <button class="close-btn">X</button>
  `;
    // add a listener to the alert to see if they clicked on the X
    // if they did then remove the child
    alert.addEventListener('click', function(e) {
      if(e.target.classList.contains("close-btn")) { 
          alert.remove(); // Remove the alert when X is clicked
      }
  });
    // add the alert to the top of main
    const main = document.querySelector('main');
    main.prepend(alert);
    // make sure they see the alert by scrolling to the top of the window
    // you may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
    if(scroll)
      window.scrollTo(0,0);

}