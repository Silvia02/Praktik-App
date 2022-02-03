if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", getProducts);
} else {
  getProducts();
}

const productsData = document.getElementById("FirstProducts");
const mascaraData = document.getElementById("MascaraProducts");

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
      allNails += `<button class='shop-item-button' data-id="${productItems["id"]}">ADD TO CART</button>`;
      allNails += `<h4>`;
      allNails += `<i>${productItems["brand"]}</i>`;
      allNails += `</h4>`;
      allNails += `<span></span>`;
      allNails += `<p>${productItems["name"]}</p>`;
      allNails += `<p class="cart-price">$ ${productItems["price"]}</p><br>`;
      allNails += `</div>`;
    }
    productsData.innerHTML = allNails;

    //API call two

    let responseTwo = await fetch(`${UrlProductMascara}`);
    let productMascara = await responseTwo.json();
    console.log(productMascara);

    let mascarasImages = "";
    for (let allMascara of productMascara) {
      mascarasImages += `<div class="products">`;
      mascarasImages += `<img class="shop-item-image" src=" ${allMascara["image_link"]}"/>`;
      mascarasImages += `<button class="shop-item-button" data-id=${allMascara["id"]}">ADD TO CART</button>`;
      mascarasImages += `<h4>`;
      mascarasImages += `<i>${allMascara["brand"]}</i>`;
      mascarasImages += `</h4>`;
      mascarasImages += `<span></span>`;
      mascarasImages += `<p>${allMascara["name"]} </p>`;
      mascarasImages += `<p class="cart-price">$ ${allMascara["price"]}</p><br>`;
      mascarasImages += `</div>`;
    }

    mascaraData.innerHTML = mascarasImages;
  } catch (message) {
    throw new Error(message);
  }

  // create a new container inside the CART with added products
  var noti = document.querySelector("h1");
  let btns = document.getElementsByClassName("shop-item-button");
  var select = document.querySelector(".select");

  //loop through and add data-count with clicked products
  for (let btn of btns) {
    btn.addEventListener("click", (e) => {
      var btnT = Number(noti.getAttribute("data-count") || 0);
      noti.setAttribute("data-count", btnT + 1);
      noti.classList.add("zero");

      // image --animation to cart ---//
      // var image = e.target.parentNode.parentNode.querySelector("img");
      // var span = e.target.parentNode.parentNode.querySelector("span");
      // var s_image = image.cloneNode(false);
      // span.appendChild(s_image)[0];
      // span.classList.add("active");

      // setTimeout(() => {
      //   span.classList.remove("active");
      //   span.removeChild(s_image);
      // }, 500);

      // copy and paste into a new container //
      var inputElem = document.createElement("input");
      inputElem.type = "number";
      inputElem.value = "1";
      inputElem.className = "cart-quantity-input";
      // var para = document.createElement("button");
      // para.innerHTML = "Buy";
      var removeBtn = document.createElement("button");
      removeBtn.className = "remove";
      removeBtn.innerHTML = "Remove";
      var backBtn = document.createElement("a");
      backBtn.className = "backBtn";
      backBtn.innerHTML = "back";
      backBtn.href = "index.html";
      var parent = e.target.parentNode; //select
      var clone = parent.cloneNode(true);

      select.appendChild(clone);
      clone.appendChild(inputElem);
      //clone.appendChild(para);
      clone.appendChild(removeBtn);
      select.appendChild(backBtn);

      //display the cloned Node
      if (clone) {
        noti.onclick = () => {
          select.classList.toggle("display");
          changed();
        };
        //event to remove clicked product row inside the cart
        const removeButtons = document.getElementsByClassName("remove");
        Array.from(removeButtons).forEach((removeButton) => {
          removeButton.addEventListener("click", () => {
            removeButton.parentNode.remove();
           
          
            updateCartTotal();
          });
        });
        //loop through input products row inside the cart to change their price
        const inputs = document.querySelectorAll("input");
        for (let i = 0; i < inputs.length; i++) {
          const result = inputs[i];
          console.log(result);
          result.addEventListener("change", changed);
        }
        // The input can´t be under 0, -1
        function changed(event) {
          const input = event.target;
          if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
          }

          updateCartTotal();
        }
        //update the Cart Total price
        function updateCartTotal() {
          let cartContainer = document.querySelector(".select");
          let cartRow = cartContainer.querySelectorAll(".products");

          //console.log(cartContainer)
          console.log(cartRow); //nodeList
          let total = 0;
          for (let i = 0; i < cartRow.length; i++) {
            let result = cartRow[i];
            console.log(result); // class Products
            let priceElement = result.getElementsByClassName("cart-price")[0];
            console.log(priceElement); // price
            let quantityElement = result.getElementsByClassName(
              "cart-quantity-input"
            )[0];
            console.log(quantityElement);
            let price = parseFloat(priceElement.innerText.replace("$", " "));// do only numbers
            let quantity = quantityElement.value;
            total = total + price * quantity;
            console.log(total);
            total = Math.round(total * 100) / 100;
          }
          let totalPrice = document.createElement("p");
          cartContainer.appendChild(totalPrice);
          totalPrice.innerText = "TOTAL: " + " $ " + total;
        }
      }
    }); //event
  } //the for loop ends
}
