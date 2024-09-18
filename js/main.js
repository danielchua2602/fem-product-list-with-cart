import { getData } from "./data.js";

const removeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>`;
const cartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z"/></clipPath></defs></svg>`;
const increSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>`;
const decreSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>`;

async function createItemCard() {
  const data = await getData();

  const itemsContainer = document.querySelector("#items-container");

  // Create item cards
  data.forEach((item) => {
    const itemCard = document.createElement("div");
    itemCard.className = "item-card";
    itemCard.innerHTML = `
        <div class="img-container">
            <img alt="item-image" src="${item.image.desktop}"/>
            <div class="btn-container">
              <button class="add-to-cart-btn">
                <div class="default-btn-content">
                  ${cartSvg}
                  <p>Add to Cart</p>
                </div>
              </button>
              <div class="selected-btn-content">
                  <button class="decrement-btn circle-btn">${decreSvg}</button>
                  <span class="item-counter"></span>
                  <button class="increment-btn circle-btn">${increSvg}</button>
              </div>
            </div>
        </div>
        <p>
            <span class=item-category>${item.category}<span>
            <br>
            <span class=item-name>${item.name}</span>
            <br>
            <span class=item-price>$${item.price.toFixed(2)}</span>
        </p>`;

    itemsContainer.appendChild(itemCard);
  });

  const cards = document.querySelectorAll(".item-card");

  let cartQuantity = 0;

  cards.forEach((card) => {
    let itemQuantity = 0;

    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    const selectedBtnContent = card.querySelector(".selected-btn-content");

    const decrementBtn = card.querySelector(".decrement-btn");
    const incrementBtn = card.querySelector(".increment-btn");

    const itemCounter = card.querySelector(".item-counter");

    const itemName = card.querySelector(".item-name").textContent;

    const itemDetails = data.find((item) => item["name"] === itemName);

    addToCartBtn.addEventListener("click", handleAddItemClick);
    decrementBtn.addEventListener("click", handleDecrementClick);
    incrementBtn.addEventListener("click", handleIncrementClick);

    function handleAddItemClick() {
      itemQuantity = 1;
      cartQuantity += 1;

      itemCounter.textContent = itemQuantity;

      addToCartBtn.style.display = "none";
      selectedBtnContent.style.display = "flex";

      updateCartItem();
      updateCartQuantity();
    }

    function handleDecrementClick() {
      if (itemQuantity > 0) {
        itemQuantity -= 1;
        cartQuantity -= 1;

        itemCounter.textContent = itemQuantity;
        updateCartItem();
      }

      if (itemQuantity === 0) {
        addToCartBtn.style.display = "block";
        selectedBtnContent.style.display = "none";

        removeCartItem();
      }

      updateCartQuantity();
    }

    function handleIncrementClick() {
      itemQuantity += 1;
      cartQuantity += 1;

      itemCounter.textContent = itemQuantity;

      updateCartItem();
      updateCartQuantity();
    }

    function updateCartQuantity() {
      document.querySelector("#cart-quantity").textContent = cartQuantity;

      if (cartQuantity > 0) {
        document.querySelector(".cart-items").style.display = "grid";
        document.querySelector(".order-summary-container").style.display =
          "flex";
        document.querySelector(".empty-cart").style.display = "none";
      }

      if (cartQuantity === 0) {
        document.querySelector(".cart-items").style.display = "none";
        document.querySelector(".empty-cart").style.display = "flex";
      }

      updateOrderTotalPrice();
    }

    function updateCartItem() {
      const cartItems = document.querySelector(".cart-items");
      const totalItemCost = itemDetails.price * itemQuantity;

      // Cart item element not yet created
      // Create cart item
      if (document.getElementById(itemDetails.name) === null) {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.id = itemDetails.name;
        cartItem.innerHTML = `
            <div class="cart-item-details">
              <span class="cart-item-name">${itemDetails.name}</span>
              <div>
                <span class="cart-item-quantity">${itemQuantity}x</span>
                <span class="cart-item-price">@$${itemDetails.price.toFixed(
                  2
                )}</span> 
                <span class="cart-total-item-price">$${totalItemCost.toFixed(
                  2
                )}</span>
              </div>
            </div>
            <button class="remove-btn circle-btn">${removeSvg}</button>`;

        cartItems.prepend(cartItem);

        const removeBtn = cartItem.querySelector(".remove-btn");
        removeBtn.addEventListener("click", removeCartItem);
      }
      // Update quantity
      else {
        const cartItem = document.getElementById(itemDetails.name);
        cartItem.querySelector(".cart-item-quantity").textContent =
          itemQuantity + "x";
        cartItem.querySelector(
          ".cart-total-item-price"
        ).textContent = `$${totalItemCost.toFixed(2)}`;
      }
    }

    function updateOrderTotalPrice() {
      const orderTotalPrice = document.getElementById("order-total-price");
      const itemPrices = document.querySelectorAll(".cart-total-item-price");

      let totalPrice = 0;
      itemPrices.forEach(
        (itemPrice) =>
          (totalPrice += parseFloat(itemPrice.textContent.replace("$", "")))
      );

      orderTotalPrice.textContent = "$" + totalPrice.toFixed(2);
    }

    function removeCartItem() {
      const itemToRemove = document.getElementById(itemDetails.name);

      if (itemToRemove !== null) {
        cartQuantity -= itemQuantity;
        itemQuantity = 0;

        itemToRemove.remove();

        itemCounter.textContent = itemQuantity;

        if (itemQuantity === 0) {
          addToCartBtn.style.display = "block";
          selectedBtnContent.style.display = "none";
        }

        updateCartQuantity();
      }
    }

    const orderConfirmBtn = document.querySelector(".order-confirm-btn");
    const startNewBtn = document.querySelector("#start-new-btn");

    orderConfirmBtn.addEventListener("click", handleOrderConfirmBtnClick);
    startNewBtn.addEventListener("click", handleStartNewBtnClick);

    function handleStartNewBtnClick() {
      document.querySelector(".order-modal").style.display = "none";

      itemQuantity = 0;
      removeCartItem();

      cartQuantity = 0;
      updateCartQuantity();

      const orderedItems = document.querySelector(".ordered-items");
      orderedItems.innerHTML = "";
    }
  });

  function handleOrderConfirmBtnClick() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    // Opens the modal
    document.querySelector(".order-modal").style.display = "flex";
    const orderedItems = document.querySelector(".ordered-items");

    const cartItems = document.querySelectorAll(".cart-item");


    cartItems.forEach((cartItem) => {
      const orderedItem = document.createElement("div");
      const itemDetails = data.find((item) => item["name"] === cartItem.id);

      console.log(itemDetails.image.thumbnail);
      
      orderedItem.className = "ordered-item";
      orderedItem.innerHTML = `                
        <div class="flex-group">
          <img class="small-img" alt='image-thumbnail' src="${itemDetails.image.thumbnail}"/>
          <div class="cart-item-details">
            <span class="cart-item-name">${itemDetails.name}</span>
            <div>
              <span class="cart-item-quantity">${cartItem.querySelector(".cart-item-quantity").textContent}</span>
              <span class="cart-item-price">${"$" + itemDetails.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <span class="bold-text">${cartItem.querySelector(".cart-total-item-price").textContent}</span>`;

      orderedItems.append(orderedItem);
    });

    const orderSummary = document.createElement("div");

    orderSummary.className = "order-summary-price pad-top-btm-1";
    orderSummary.innerHTML = `
      <span class="bold-text">Order Total</span>
      <span class="extra-bold-text fs-700">
        ${document.getElementById("order-total-price").textContent}
      </span>`;

    orderedItems.append(orderSummary);
  }
}

createItemCard();
