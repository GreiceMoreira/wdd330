import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    })
    return convertedJSON
}


function packageItems(items) {
    const simplifiedItems = items.map((item) => {
      console.log(item);
      return {
        id: item.Id,
        price: item.FinalPrice,
        name: item.Name,
        quantity: 1,
      };
    });
    return simplifiedItems;
  }

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary(){
        const summaryElement = document.querySelector("#cartTotal");
        const itemNumElement = document.querySelector("#num-items");
        
        itemNumElement.innerHTML = this.list.length;

        const amounts = this.list.map((item) => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item);
        summaryElement.innerHTML = `$${this.itemTotal.toFixed(2)}`;

    }

    calculateOrderTotal() {

        this.tax = (this.itemTotal * .06);
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = (
          parseFloat(this.itemTotal) +
          parseFloat(this.tax) +
          parseFloat(this.shipping)
        )
     
        this.displayOrderTotals();
      }

      displayOrderTotals() {
        const parts = ['tax', 'shipping', 'orderTotal'];
    
       
        function getOnHTML(part) {
            return document.querySelector(`#${part}`);
        }
    

        function setText(part) {
            const el = getOnHTML.call(this, part);
            if (!el) return;
            el.innerText = `$${this[part].toFixed(2)}`;
        }
    

        parts.forEach(function(part) {
            setText.call(this, part);
        }, this); 
    }
    

    async checkout() {
        const formElement = document.forms["checkout"];
            
        if (!validateFormAndShowErrors(formElement)) {
            return;  // Prevents order submission if the form is invalid
        }

        const order = generateOrderData(formElement, this.orderTotal, this.tax, this.shipping, this.list);
        console.log(order);

            // Mock service
    services.checkout = async function(order) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Order submitted successfully!"
                });
            }, 1000); 
        });
    };

        try{
            const res = await services.checkout(order);
            console.log(res);
            setLocalStorage("so-cart", []);
            location.assign("/checkout/success.html");
        }catch (err) {
            console.log(err);
            if (err.name === 'servicesError') {
                alert(`There was a problem with your order: ${err.message}`);
            } else {
                alert("There was a problem submitting your order. Please try again.");
            }
        }
    }


}

function generateOrderData(formElement, orderTotal, tax, shipping, list) {
    const order = formDataToJSON(formElement);  
    order.orderDate = new Date().toISOString();  
    order.orderTotal = orderTotal.toFixed(2);   
    order.tax = tax.toFixed(2);                
    order.shipping = shipping;                 
    order.items = packageItems(list);          
    return order;                           
}

function validateFormAndShowErrors(formElement) {
    if (!formElement.checkValidity()) {
        const invalidFields = formElement.querySelectorAll('input:invalid');  
        console.log(invalidFields);
        
        invalidFields.forEach((field) => {
            alertMessage(`Invalid ${field.name}`);
        });
     
        formElement.reportValidity();
        return false; 
    }
    return true;
}