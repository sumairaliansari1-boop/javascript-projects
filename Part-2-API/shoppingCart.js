let productsContainer = document.querySelector("#products");
      let productMsg = document.querySelector("#productMsg");

      let API_URL = "https://fakestoreapi.com/products";

      let cart = document.querySelector("#cart");
      let emptyCart = document.querySelector("#empty-cart");
      let total = document.querySelector("#total");
      let clrBtn = document.querySelector("#clear-cart");
      let darkbtn = document.querySelector(".dark");

      let cartData = [];

      async function getProducts() {
        try {
          let response = await fetch(API_URL);

          if (!response.ok) {
            throw new Error("Something is wrong " + response.status);
          }

          let result = await response.json();
          console.log(result);

          result.forEach((product) => {
            let div = document.createElement("div");

            div.classList.add("product");
            div.dataset.id = product.id;
            div.dataset.price = product.price;

            div.innerHTML = `
              <h2>title: ${product.title}</h2>
              <img src="${product.image}" alt="${product.title}">
              <p>Price: USD ${Number(product.price).toFixed(2)}</p>
              <button class="add-cart">Add to Cart</button>
            `;
            productsContainer.append(div);
          });

          productMsg.textContent = "";
        } catch (error) {
          productMsg.textContent = error.message;
        }
      }

      getProducts();

      productsContainer.addEventListener("click", (x1) => {
        if (x1.target.classList.contains("add-cart")) {
          let productId = x1.target.parentElement.dataset.id;

          let existingProduct = cartData.find((item) => {
            return item.id === productId;
          });

          if (existingProduct) {
            existingProduct.quantity++;

            let cartItem = cart.querySelector(`[data-id="${productId}"]`);
            let quantitySpan = cartItem.querySelector("span");
            quantitySpan.textContent = existingProduct.quantity;

            let newSubtotal = existingProduct.price * existingProduct.quantity;
            cartItem.children[3].textContent = `Subtotal: USD ${newSubtotal.toFixed(2)}`;

            total.textContent = (
              Number(total.textContent) + existingProduct.price
            ).toFixed(2);

            localStorage.setItem("data", JSON.stringify(cartData));
          } else {
            let product = x1.target.parentElement;

            let div = document.createElement("div");
            div.dataset.id = productId;

            let price = Number(product.dataset.price);
            let name = product.querySelector("h2").textContent;

            div.innerHTML = `
            <p>${name}</p>
            <p>Price: USD ${price.toFixed(2)}</p>
            <p>Quantity <span>1</span></p>
            <p>Subtotal: USD ${price.toFixed(2)}</p>
            <button class="rem">Remove</button>
            <hr>
            `;

            cart.append(div);

            emptyCart.textContent = "";

            cartData.push({
              id: productId,
              name: name,
              price: price,
              quantity: 1,
            });

            total.textContent = (Number(total.textContent) + price).toFixed(2);

            localStorage.setItem("data", JSON.stringify(cartData));
          }
        }
      });

      cart.addEventListener("click", (x) => {
        if (x.target.classList.contains("rem")) {
          let productId = x.target.parentElement.dataset.id;

          let removeProduct = cartData.find((item) => {
            return item.id === productId;
          });

          let remnumFinal = removeProduct.price * removeProduct.quantity;

          total.textContent = (Number(total.textContent) - remnumFinal).toFixed(
            2,
          );

          x.target.parentElement.remove();

          let updatedCart = cartData.filter((remove) => {
            return remove.id !== productId;
          });
          localStorage.setItem("data", JSON.stringify(updatedCart));

          cartData = updatedCart;

          if (cartData.length === 0) {
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
          // calulation for refreshing the subtotal exist
          let price = obj.price;
          let subTotal = price * obj.quantity;

          let div = document.createElement("div");
          div.dataset.id = obj.id;
          div.innerHTML = `
                <p>${obj.name}</p>
               <p>Price: USD ${price}</p>
                <p>Quantity <span>${obj.quantity}</span></p>
                <p>Subtotal: USD ${subTotal.toFixed(2)}</p>
                <button class="rem">Remove</button>
                <hr>
                `;

          cart.append(div);

          let newTotal = Number(total.textContent);
          newTotal += subTotal;
          total.textContent = newTotal.toFixed(2);
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
