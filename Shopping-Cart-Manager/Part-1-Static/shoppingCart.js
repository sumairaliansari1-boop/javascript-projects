
let productsContainer = document.querySelector("#products");

let products = document.querySelectorAll(".product");
let addButtons = document.querySelectorAll(".add-cart");
let cart = document.querySelector("#cart");
let emptyCart = document.querySelector("#empty-cart");
let total = document.querySelector("#total");
let clrBtn = document.querySelector("#clear-cart");
let darkbtn = document.querySelector(".dark");

let cartData = [];

productsContainer.addEventListener("click", (x1) => {
  if (x1.target.classList.contains("add-cart")) {
    let search = x1.target.parentElement.firstElementChild.textContent;

    if (cart.innerHTML.includes(search)) {
      let items = document.querySelectorAll("p");

      items.forEach((x) => {
        if (x.textContent.trim() === search) {
          let span =
            x.nextElementSibling.nextElementSibling.querySelector("span");
          let curr = span.textContent;
          let num = Number(curr);
          let final = num + 1;
          span.textContent = final;

          let subTotal =
            x.nextElementSibling.nextElementSibling.nextElementSibling;

          let priceElement = x1.target.parentElement.children[1];
          let priceText = priceElement.textContent.replace("Price: Rs.", "");
          let aakhri = priceText.replace(",", "");

          let multiply = aakhri * final;

          let oldSubtotal =
            x.nextElementSibling.nextElementSibling.nextElementSibling;
          let oldSubtotalrep = oldSubtotal.textContent.replace(
            "Subtotal: Rs.",
            "",
          );

          let diffrence = multiply - Number(oldSubtotalrep);

          subTotal.textContent = `Subtotal: Rs.${multiply}`;

          let newTotal = Number(total.textContent);
          newTotal += diffrence;

          total.textContent = newTotal;

          cartData.forEach((obj) => {
            if (obj.name === search) {
              obj.quantity = final;
            }
          });

          localStorage.setItem("data", JSON.stringify(cartData));
        }
      });
    } else {
      let sve = x1.target.parentElement.children[1].textContent;
      let result = sve.replace("Price: Rs. ", "");
      let finalResult = result.replace(",", "");
      let num = Number(finalResult);

      let currTotal = Number(total.textContent);
      let newTotal = num + currTotal;

      total.textContent = newTotal;

      emptyCart.textContent = "";

      let div = document.createElement("div");
      div.innerHTML += `
                    <p>${x1.target.parentElement.firstElementChild.textContent}</p>
                    <p>${x1.target.parentElement.children[1].textContent}</p>
                    <p>Quantity <span>1</span></p>
                    <p>Subtotal: Rs.${num}</p>
                    <button class="rem">Remove</button>

                    `;

      cart.append(div);

      let hr = document.createElement("hr");
      div.append(hr);

      let objeect = {
        name: x1.target.parentElement.firstElementChild.textContent,
        price: x1.target.parentElement.children[1].textContent,
        quantity: 1,
      };

      cartData.push(objeect);

      console.log(cartData);

      localStorage.setItem("data", JSON.stringify(cartData));
    }
  }
});

cart.addEventListener("click", (x) => {
  if (x.target.classList.contains("rem")) {
    let removeSubtotal = x.target.parentElement.children[3];
    let remFinal = removeSubtotal.textContent.replace("Subtotal: Rs.", "");
    let remnumFinal = Number(remFinal);
    total.textContent = Number(total.textContent) - remnumFinal;

    let valueRemForLocal = x.target.parentElement.firstElementChild.textContent;

    x.target.parentElement.remove();

    let updatedCart = cartData.filter((remove) => {
      return remove.name !== valueRemForLocal;
    });

    localStorage.setItem("data", JSON.stringify(updatedCart));
    cartData = updatedCart;

    if (cart.textContent.trim() === "") {
      emptyCart.textContent = "Your cart is empty 🛒";
    }
  }
});

clrBtn.addEventListener("click", (clr) => {
  if (clr.target.id === "clear-cart") {
    let cartItems = cart.querySelectorAll("div");

    cartItems.forEach((rm) => {
      rm.remove();
    });

    total.textContent = 0;
    localStorage.removeItem("data");
    emptyCart.textContent = "Your cart is empty 🛒";
    cartData.length = 0;
  }
});

let extract = JSON.parse(localStorage.getItem("data"));

if (localStorage.getItem("data")) {
  emptyCart.textContent = "";

  extract.forEach((obj) => {
    let detect = obj.price.replace("Price: Rs.", "");
    let price = detect.replace(",", "");
    let subTotal = price * obj.quantity;

    let div = document.createElement("div");
    div.innerHTML = `
                <p>${obj.name}</p>
                <p>${obj.price}</p>
                <p>Quantity <span>${obj.quantity}</span></p>
                <p>Subtotal: Rs.${subTotal}</p>
                <button class="rem">Remove</button>
                <hr>
                `;

    cart.append(div);

    let newTotal = Number(total.textContent);
    newTotal += subTotal;
    total.textContent = newTotal;
  });

  cartData = extract;
}

darkbtn.addEventListener("click", (ON) => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}
