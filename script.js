
/* =========================
   ZUS COFFEE WEBSITE
   CART + SMART SEARCH
========================= */


/* =========================
   CART SYSTEM
========================= */

const cartButton = document.getElementById("cartButton");

const cartPanel = document.getElementById("cartPanel");

const closeCart = document.getElementById("closeCart");

const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

const cart = [];


function openCart() {

  cartPanel.classList.add("open");

  overlay.classList.add("show");

  cartPanel.setAttribute("aria-hidden", "false");

}


function hideCart() {

  cartPanel.classList.remove("open");

  overlay.classList.remove("show");

  cartPanel.setAttribute("aria-hidden", "true");

}


cartButton.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

overlay.addEventListener("click", hideCart);


/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");


menuToggle.addEventListener("click", () => {

  navLinks.classList.toggle("show");

});


document.querySelectorAll("nav a").forEach((link) => {

  link.addEventListener("click", () => {

    navLinks.classList.remove("show");

  });

});



/* =========================
   COFFEE CUSTOMIZATION
========================= */

const customModal =
  document.getElementById("customModal");

const closeCustomModal =
  document.getElementById("closeCustomModal");

const customTitle =
  document.getElementById("customTitle");

const customDescription =
  document.getElementById("customDescription");

const regularPrice =
  document.getElementById("regularPrice");

const customTotal =
  document.getElementById("customTotal");

const confirmCustomization =
  document.getElementById("confirmCustomization");

const iceLevel =
  document.getElementById("iceLevel");

const sugarLevel =
  document.getElementById("sugarLevel");

const extraEspresso =
  document.getElementById("extraEspresso");


let selectedProduct = null;


/* OPEN MODAL */

function openCustomization(card) {

  selectedProduct = {

    name: card.dataset.name,

    price: Number(card.dataset.price),

    description:
      card.querySelector(".product-info p")
        ?.textContent || ""

  };


  customTitle.textContent =
    selectedProduct.name;

  customDescription.textContent =
    selectedProduct.description;

  regularPrice.textContent =
    "RM " + selectedProduct.price.toFixed(2);


  document.querySelector(
    'input[name="drinkSize"][value="Regular"]'
  ).checked = true;


  iceLevel.value = "Normal ice";

  sugarLevel.value = "Normal sugar";

  extraEspresso.checked = false;


  updateCustomizationTotal();


  customModal.classList.add("open");

  customModal.setAttribute("aria-hidden", "false");

}


/* CLOSE MODAL */

function closeCustomization() {

  customModal.classList.remove("open");

  customModal.setAttribute("aria-hidden", "true");

  selectedProduct = null;

}


closeCustomModal.addEventListener(
  "click",
  closeCustomization
);


/* CLICK OUTSIDE MODAL */

customModal.addEventListener("click", (event) => {

  if (event.target === customModal) {

    closeCustomization();

  }

});


/* UPDATE TOTAL */

function updateCustomizationTotal() {

  if (!selectedProduct) return;


  const selectedSize = document.querySelector(
    'input[name="drinkSize"]:checked'
  );


  const sizeExtra =
    Number(selectedSize?.dataset.extra || 0);


  const espressoExtra =
    extraEspresso.checked ? 2 : 0;


  const total =
    selectedProduct.price +
    sizeExtra +
    espressoExtra;


  customTotal.textContent =
    "RM " + total.toFixed(2);

}


/* SIZE CHANGE */

document.querySelectorAll(
  'input[name="drinkSize"]'
).forEach((input) => {

  input.addEventListener("change", () => {

    document.querySelectorAll(
      ".custom-choice"
    ).forEach((choice) => {

      choice.classList.remove("selected");

    });


    input.closest(".custom-choice")
      ?.classList.add("selected");


    updateCustomizationTotal();

  });

});


/* EXTRA ESPRESSO */

extraEspresso.addEventListener("change", () => {

  updateCustomizationTotal();

});


/* ADD BUTTONS OPEN CUSTOMIZATION */

document.querySelectorAll(".add-btn").forEach((button) => {

  button.addEventListener("click", () => {

    const card =
      button.closest(".product-card");

    openCustomization(card);

  });

});


/* CONFIRM ADD TO CART */

confirmCustomization.addEventListener("click", () => {

  if (!selectedProduct) return;


  const selectedSize = document.querySelector(
    'input[name="drinkSize"]:checked'
  );


  const sizeExtra =
    Number(selectedSize?.dataset.extra || 0);


  const espressoExtra =
    extraEspresso.checked ? 2 : 0;


  const finalPrice =
    selectedProduct.price +
    sizeExtra +
    espressoExtra;


  const customizations = {

    size: selectedSize?.value || "Regular",

    ice: iceLevel.value,

    sugar: sugarLevel.value,

    extraEspresso: extraEspresso.checked

  };


  cart.push({

    name: selectedProduct.name,

    price: finalPrice,

    customizations: customizations

  });


  renderCart();

  closeCustomization();

  openCart();

});


/* =========================
   RENDER CART
========================= */


function renderCart() {
  cartCount.textContent = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  if (!cart.length) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your cart is empty.</p>';

    cartTotal.textContent = "RM 0.00";
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => {
    const options = item.customizations;
    const quantity = item.quantity || 1;

    const details = options
      ? `
        <small>
          Size: ${options.size}<br>
          Ice: ${options.ice}<br>
          Sugar: ${options.sugar}
          ${
            options.extraEspresso
              ? "<br>Extra espresso"
              : ""
          }
        </small>
      `
      : "";

    return `
      <div class="cart-line">
        <span>
          <strong>${item.name}</strong>

          ${details}

          <br>

          <small>
            RM ${item.price.toFixed(2)} each
          </small>

          <div class="quantity-controls">
            <button onclick="changeQuantity(${index}, -1)">−</button>
            <span>${quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </span>

        <span>
          <strong>
            RM ${(item.price * quantity).toFixed(2)}
          </strong>

          <br>

          <button onclick="removeItem(${index})">
            Remove
          </button>
        </span>
      </div>
    `;
  }).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

 cartTotal.textContent = "RM " + total.toFixed(2);
}


// CHANGE QUANTITY
function changeQuantity(index, change) {
  cart[index].quantity = (cart[index].quantity || 1) + change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}


// REMOVE ITEM
function removeItem(index) {
  cart.splice(index, 1);

  renderCart();
}


/* =========================
   SMART COFFEE SEARCH
========================= */

const coffeeSearch =
  document.getElementById("coffeeSearch");

const clearSearch =
  document.getElementById("clearSearch");

const searchMessage =
  document.getElementById("searchMessage");

const productCards =
  document.querySelectorAll(".product-card");

const categoryButtons =
  document.querySelectorAll(".category-btn");


let selectedCategory = "all";


function filterCoffeeMenu() {

  const searchTerm =
    coffeeSearch.value.toLowerCase().trim();

  let foundProducts = 0;


  productCards.forEach((card) => {

    const productName =
      card.dataset.name.toLowerCase();

    const productCategory =
      (card.dataset.category || "").toLowerCase();

    const productText =
      card.textContent.toLowerCase();


    const matchesSearch =

      productName.includes(searchTerm) ||

      productCategory.includes(searchTerm) ||

      productText.includes(searchTerm);


    const matchesCategory =

      selectedCategory === "all" ||

      productCategory.includes(selectedCategory);


    const shouldShow =

      matchesSearch && matchesCategory;


    card.style.display =

      shouldShow ? "" : "none";


    if (shouldShow) {

      foundProducts++;

    }

  });


  clearSearch.style.display =

    searchTerm ? "flex" : "none";


  if (foundProducts === 0) {

    searchMessage.textContent =

      "No coffee found. Try another search ☕";

  }

  else if (

    searchTerm ||

    selectedCategory !== "all"

  ) {

    searchMessage.textContent =

      `${foundProducts} drink${

        foundProducts === 1 ? "" : "s"

      } found`;

  }

  else {

    searchMessage.textContent = "";

  }

}


/* =========================
   SEARCH INPUT
========================= */

coffeeSearch.addEventListener("input", () => {

  filterCoffeeMenu();

});


/* =========================
   CLEAR SEARCH
========================= */

clearSearch.addEventListener("click", () => {

  coffeeSearch.value = "";

  filterCoffeeMenu();

  coffeeSearch.focus();

});


/* =========================
   CATEGORY FILTERS
========================= */

categoryButtons.forEach((button) => {

  button.addEventListener("click", () => {

    selectedCategory =

      button.dataset.category;


    categoryButtons.forEach((btn) => {

      btn.classList.remove("active");

    });


    button.classList.add("active");


    filterCoffeeMenu();

  });

});


/* =========================
   CHECKOUT
========================= */

document.getElementById("checkoutButton")

  .addEventListener("click", () => {

    if (!cart.length) {

      alert("Your cart is empty.");

      return;

    }


    alert(

      "Demo checkout only. " +

      "Connect a backend/payment provider " +

      "for real orders."

    );

  });


/* =========================
   FOOTER YEAR
========================= */

document.getElementById("year").textContent =

  new Date().getFullYear();
  /* ICE PILL BUTTONS */

const icePills = document.querySelectorAll(
  "#iceLevelPills .choice-pill"
);

icePills.forEach((button) => {
  button.addEventListener("click", () => {
    icePills.forEach((pill) => {
      pill.classList.remove("active");
    });

    button.classList.add("active");

    iceLevel.value = button.dataset.value;
  });
});
/* SUGAR PILL BUTTONS */

const sugarPills = document.querySelectorAll(
  "#sugarLevelPills .choice-pill"
);

sugarPills.forEach((button) => {
  button.addEventListener("click", () => {
    sugarPills.forEach((pill) => {
      pill.classList.remove("active");
    });

    button.classList.add("active");

    sugarLevel.value = button.dataset.value;
  });
});