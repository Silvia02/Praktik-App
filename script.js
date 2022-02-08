if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", getProducts);
} else {
  getProducts();
}

const productsData = document.getElementById("FirstProducts");
const mascaraData = document.getElementById("MascaraProducts");
const cartRouwContainer = document.getElementById("containerCart");

const UrlProductsLipstick =
  "http://makeup-api.herokuapp.com/api/v1/products.json?brand=covergirl&product_type=lipstick";
const UrlProductMascara =
  "https://makeup-api.herokuapp.com/api/v1/products.json?product_tags=Vegan&product_type=mascara";
console.log(UrlProductMascara);

async function getProducts() {
  try {
    let responseData = await fetch(`${UrlProductsLipstick}`);
    let data = await responseData.json();
    console.log(data);

    let allNails = " ";

    for (let productItems of data) {
      allNails += `<div class='products'>`;
      allNails += `<img class="shop-item-image" src="${productItems["image_link"]} "/>`;
      allNails += `<button id='shop-item-button' data-id="${productItems["id"]}">ADD TO CART</button>`;
      allNails += `<h4>`;
      allNails += `<i>${productItems["brand"]}</i>`;
      allNails += `</h4>`;
      allNails += `<span></span>`;
      allNails += `<p class="item-name">${productItems["name"]}</p>`;
      allNails += `<p class="cart-price">$ ${productItems["price"]}</p><br>`;
      allNails += `</div>`;
    }
    productsData.innerHTML = allNails;

    //API call two
    let responseTwo = await fetch(`${UrlProductMascara}`);
    let productMascara = await responseTwo.json();
    //console.log(productMascara);

    let mascarasImages = "";
    for (let allMascara of productMascara) {
      mascarasImages += `<div class="products">`;
      mascarasImages += `<img class="shop-item-image" src="${allMascara["image_link"]}"/>`;
      mascarasImages += `<button id="shop-item-button" type="button">ADD TO CART</button>`;
      mascarasImages += `<h4>`;
      mascarasImages += `<i>${allMascara["brand"]}</i>`;
      mascarasImages += `</h4>`;
      mascarasImages += `<span></span>`;
      mascarasImages += `<p class="item-name">${allMascara["name"]} </p>`;
      mascarasImages += `<p class="cart-price">$ ${allMascara["price"]}</p><br>`;
      mascarasImages += `</div>`;
    }

    mascaraData.innerHTML = mascarasImages;

    //event to remove clicked product row inside the cart
    let removeButtons = document.getElementsByClassName("btn-danger");
    console.log(removeButtons);
    for (let i = 0; i < removeButtons.length; i++) {
      let removed = removeButtons[i];
      removed.addEventListener("click", removeCartItem);
    }

    // get all Button inside products container
    let testbtn = Array.from(document.querySelectorAll("button"));
    console.log(testbtn);
    for (let i = 0; i < testbtn.length; i++) {
      var button = testbtn[i];
      button.addEventListener("click", addItemEvent);
    }

    //find the right parentElement div and their children
    function addItemEvent(event) {
      var button = event.target;
      let resultBtn = button.parentElement;
      console.log(resultBtn);

      let prices = resultBtn.getElementsByClassName("cart-price")[0].innerHTML;
      console.log(prices);
      let imageSrc = resultBtn.getElementsByClassName("shop-item-image")[0].src;
      console.log(imageSrc);
      let names = resultBtn.getElementsByClassName("item-name")[0].innerHTML;
      console.log(names);

      copyToCart(prices, imageSrc, names);
    }
    // loop through all cart inputs
    let inputQuantity = document.getElementsByClassName("cart-quantity-input");
    for (let i = 0; i < inputQuantity.length; i++) {
      let inputResult = inputQuantity[i];
      inputResult.addEventListener("change", quantityChanged);
      updateCart();
    }
    // remove parentElement CartRow
    function removeCartItem(event) {
      var buttonClicked = event.target;
      buttonClicked.parentElement.parentElement.remove();
      updateCart();
    }

    // The input can´t be under 0, -1
    function quantityChanged(event) {
      let input = event.target;
      if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
      }
      updateCart();
    }

      
       //create a new DIV with tre parameters
    function copyToCart(prices, imageSrc, names) {
      let newDiv = document.createElement("div");
      newDiv.className = "newDivCart";
      var cartRowContents = `
          <div class="cart-item cart-column">
              <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
              <span class="cart-item-title">${names}</span>
          </div>
          <span class="cart-price cart-column">${prices}</span>
          <div class="cart-quantity cart-column">
              <input class="cart-quantity-input" type="number" value="1">
              <button class="btn-danger" type="button">REMOVE</button>
          </div>`;
      newDiv.innerHTML = cartRowContents;
      cartRouwContainer.append(newDiv);
      newDiv.addEventListener("change", quantityChanged);
      newDiv
        .getElementsByClassName("btn-danger")[0]
        .addEventListener("click", removeCartItem);
    }

        //update the Cart Total price
    function updateCart() {
      let cartContainer = document.getElementById("containerCart");
      let rowsOfProducts = cartContainer.getElementsByClassName("newDivCart");
      console.log(rowsOfProducts);
      let total = 0;
      for (let i = 0; i < rowsOfProducts.length; i++) {
        let rowsOfProductsResult = rowsOfProducts[i];

        let priceElement = rowsOfProductsResult.getElementsByClassName(
          "cart-price"
        )[0];
        let quantityElement = rowsOfProductsResult.getElementsByClassName(
          "cart-quantity-input"
        )[0];
        var price = parseFloat(priceElement.innerText.replace("$", " "));
        var quantity = quantityElement.value;
        total = total + price * quantity;
        console.log(total);
      }
      total = Math.round(total * 100) / 100;
      document.getElementsByClassName("cart-total-price")[0].innerText =
        "$" + total;
    }
  } catch (message) {
    throw new Error(message);
  }
}
