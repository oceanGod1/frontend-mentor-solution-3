// Select every necessary element
const productThumbnailIndex = Array.from(
  document.querySelectorAll(".thumbnail-cards figure")
);
const increaseProductQuantity = document.querySelector(
  ".increase-product-quantity"
);
const reduceProductQuantity = document.querySelector(
  ".reduce-product-quantity"
);
const productImageContainer = document.querySelector(
  ".product-image-container"
);
const productImageLightbox = document.querySelector(".product-image-lightbox");
const gotoPreviousImage = document.querySelector(".go-to-previous-image");
const closeMobileMenu = document.querySelector(".close-mobile-menu");
const productQuantity = document.querySelector(".product-quantity");
const openMobileMenu = document.querySelector(".open-mobile-menu");
const cartCardHolder = document.querySelector(".cart-card-holder");
const gotoNextImage = document.querySelector(".go-to-next-image");
const cartContent = document.querySelector(".cart-content");
const mobileMenu = document.querySelector(".mobile-menu");
const addToCart = document.querySelector(".add-to-cart");
const cartBadge = document.querySelector(".cart-badge");
const cartCard = document.querySelector(".cart-card");
const cartIcon = document.querySelector(".cart-icon");

let productQuantityIndex = 0;
let currentProductImage = 1;
let cartBadgeIndex = 0;
let totalQuantityInCartIndex = 0;

// Hold all resuable functions
const reusables = {
  // Toggle Mobile Menu
  toggleMobileMenu: (elem, action) => {
    elem.addEventListener("click", () => {
      mobileMenu.classList[action]("hidden");
    });
  },

  // Toggle Cart
  toggleCartCard: (elem, method, toggle1, toggle2) => {
    elem.addEventListener("click", (e) => {
      if (method(e)) {
        cartCardHolder.classList[toggle1]("hidden");
        cartCardHolder.classList[toggle2]("grid");
      }
    });
  },

  // Translate currentProductIndex to background images
  backgroundProductImages: (img) =>
    (img.style.cssText += `background: url(images/image-product-${currentProductImage}.jpg) center/cover`),

  // Thumbnail Switch During Scroll
  thumbnailSwitch: (thumbnails, method) => {
    thumbnails.filter((value) =>
      value !== method()
        ? value.classList.remove("before:absolute", "border-4")
        : value.classList.add("before:absolute", "border-4")
    );
  },

  // Product Image Generator for Desktop View
  desktopProductImages: function (parent) {
    parent.lastElementChild.remove();
    parent.insertAdjacentHTML(
      "beforeend",
      `<img class="w-[32rem] rounded-xl" src="images/image-product-${currentProductImage}.jpg" alt="current product image">`
    );
    const clonedProductThumbnailIndex = Array.from(
      parent.nextElementSibling.children
    );
    this.thumbnailSwitch(
      productThumbnailIndex,
      () => productThumbnailIndex[currentProductImage - 1]
    );
    this.thumbnailSwitch(
      clonedProductThumbnailIndex,
      () => clonedProductThumbnailIndex[currentProductImage - 1]
    );
  },

  // Product Image Scrolling Function
  productImageGen: function (elem, method1, method2, method3, arg) {
    elem.addEventListener("click", () => {
      if (method1()) {
        method2();
        this[method3](arg);
      }
    });
  },

  // Set Product Quantity State
  countProduct: (elem, method1, method2) => {
    elem.addEventListener("click", () => {
      if (method1()) {
        method2();
        productQuantity.value = productQuantityIndex;
      }
    });
  },

  // Cart Badge State and success notification
  cartBadge: () => {
    cartBadgeIndex = cartBadgeIndex + productQuantityIndex;
    cartBadge.innerHTML = cartBadgeIndex;
    cartBadge.classList.remove("hidden");

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="item-added-success-message w-screen fixed top-20 z-20">
        <p class="w-80 m-auto p-4 rounded-lg text-center text-neutral1 font-bold bg-green-600">Item successfully added to cart</p>
      </div>`
    );
    setTimeout(() => {
      document.querySelector(".item-added-success-message").remove();
    }, 1000);
  },

  // Dynamically create the cards that represent the items added to the cart
  addedItemtoCart: () => {
    const totalAmount =
      document.querySelector(".product-price span").innerHTML *
      productQuantity.value;
    totalQuantityInCartIndex = productQuantityIndex;
    cartContent.insertAdjacentHTML(
      "beforeend",
      `
      <div class="cart-item grid grid-cols-[auto_1fr_auto] grid-rows-[2rem_2rem] gap-x-4">
        <img src="images/image-product-1-thumbnail.jpg" alt="cart item" class="w-16 rounded-lg row-span-2">
        <h4 class="text-secondaryLight self-center text-sm text-nowrap">${
          document.querySelector("h1").innerHTML
        }</h4>
        <img src="images/icon-delete.svg" alt="delete item from cart" class="delete-cart-item row-span-2 self-center">
        <div class="col-start-2 flex items-center">
          <span class="calculate-price text-secondaryLight self-center">${
            document.querySelector(".product-price").innerHTML
          } x ${totalQuantityInCartIndex}</span>
          <span class="total-price pl-4 text-secondary font-bold">$${totalAmount.toPrecision(
            String(totalAmount).length + 2
          )}</span>
        </div>
      </div>
      <button class="h-16 rounded-xl text-secondary font-bold bg-primary">Checkout</button>
      `
    );
  },
};

// Making use of the above 'resusables' object

// Default Displayed Product Image Using 'Translate currentProductIndex to background images'
document.addEventListener("DOMContentLoaded", () => {
  reusables.backgroundProductImages(productImageContainer);
  reusables.thumbnailSwitch(
    productThumbnailIndex,
    () => productThumbnailIndex[currentProductImage - 1]
  );
});

// Apply Toggle Mobile Menu
reusables.toggleMobileMenu(openMobileMenu, "remove");
reusables.toggleMobileMenu(closeMobileMenu, "add");

// Apply Toggle Cart card
reusables.toggleCartCard(cartIcon, (e) => e.target, "remove", "add");
reusables.toggleCartCard(
  cartCardHolder,
  (e) => e.target === cartCardHolder,
  "add",
  "remove"
);

// Apply Translate currentProductIndex to background images
reusables.productImageGen(
  gotoNextImage,
  () => currentProductImage < 4,
  () => currentProductImage++,
  "backgroundProductImages",
  productImageContainer
);
reusables.productImageGen(
  gotoPreviousImage,
  () => currentProductImage > 1,
  () => currentProductImage--,
  "backgroundProductImages",
  productImageContainer
);

// Apply Product Quantity State
reusables.countProduct(
  increaseProductQuantity,
  () => productQuantityIndex >= 0,
  () => productQuantityIndex++
);
reusables.countProduct(
  reduceProductQuantity,
  () => productQuantityIndex >= 1,
  () => productQuantityIndex--
);

// Add to cart button on-click
addToCart.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    productQuantity.value >= 1 &&
    !cartContent.classList.contains("not-empty")
  ) {
    document.querySelector(".empty-cart-message").classList.add("hidden");
    cartContent.classList.add("not-empty");
    reusables.addedItemtoCart();
    reusables.cartBadge();
  } else if (
    productQuantity.value >= 1 &&
    cartContent.classList.contains("not-empty")
  ) {
    reusables.cartBadge();
    totalQuantityInCartIndex =
      Number(totalQuantityInCartIndex) + Number(productQuantity.value);
    const totalAmount =
      document.querySelector(".product-price span").innerHTML *
      totalQuantityInCartIndex;
    document.querySelector(".calculate-price").innerHTML = `${
      document.querySelector(".product-price").innerHTML
    } x ${totalQuantityInCartIndex}`;
    document.querySelector(
      ".total-price"
    ).innerHTML = `$${totalAmount.toPrecision(String(totalAmount).length + 2)}`;
  }
  productQuantityIndex = 0;
  productQuantity.value = 0;
});

// thumbnail and cloned elements
productThumbnailIndex.forEach((thumbnail) => {
  thumbnail.addEventListener("click", (e) => {
    reusables.thumbnailSwitch(productThumbnailIndex, () => e.target);

    const clonedLightbox = productImageLightbox.cloneNode(true);
    const clonedProductImageContainer = clonedLightbox.children[0];
    const clonedProductThumbnailContainer = clonedLightbox.children[1];
    const closeFullScreenImage = clonedProductImageContainer.children[0];
    const clonedGotoPreviousImage = clonedProductImageContainer.children[1];
    const clonedGotoNextImage = clonedProductImageContainer.children[2];
    const clonedProductThumbnailIndex = Array.from(
      clonedProductThumbnailContainer.children
    );

    currentProductImage = productThumbnailIndex.indexOf(thumbnail) + 1;

    clonedLightbox.classList.add(
      "cloned-lightbox",
      "w-screen",
      "fixed",
      "top-0",
      "left-0",
      "z-20",
      "bg-neutral2Light",
      "place-content-center",
      "lg:h-screen"
    );

    clonedLightbox.style.cssText += `
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto 5.5rem;
    place-content:center;
    place-items: center;
    row-gap: 2rem`;

    clonedProductImageContainer.style.cssText += `
    background-image: inherit;
    grid-area: 1/2/2/3;`;

    clonedProductThumbnailContainer.style.cssText = `
    grid-column-start: 2;
    justify-self: stretch;
    padding-inline: 6.5rem`;

    clonedGotoNextImage.style.cssText = `
    order: 1;
    display: grid;
    box-sizing: content-box;
    transform: scale(1) translate(-1.8rem)`;

    clonedGotoPreviousImage.style.cssText = `
    display: grid;
    box-sizing: content-box;
    transform: scale(1) translate(1.8rem)`;

    closeFullScreenImage.style.cssText += `display: block`;

    clonedProductImageContainer.insertAdjacentHTML(
      "beforeend",
      `<img class="w-[32rem] rounded-xl" src="images/image-product-${currentProductImage}.jpg" alt="current product image">`
    );

    closeFullScreenImage.addEventListener("click", () => {
      clonedLightbox.style.cssText = `display: none`;
      productImageContainer.style.cssText += `background-image: url(images/image-product-${currentProductImage}.jpg)`;
    });

    reusables.productImageGen(
      clonedGotoNextImage,
      () => currentProductImage < 4,
      () => currentProductImage++,
      "desktopProductImages",
      clonedProductImageContainer
    );
    reusables.productImageGen(
      clonedGotoPreviousImage,
      () => currentProductImage > 1,
      () => currentProductImage--,
      "desktopProductImages",
      clonedProductImageContainer
    );

    document.body.append(clonedLightbox);

    clonedProductThumbnailIndex.forEach((value) => {
      value.addEventListener("click", (e) => {
        reusables.thumbnailSwitch(clonedProductThumbnailIndex, () => e.target);
        currentProductImage = clonedProductThumbnailIndex.indexOf(value) + 1;
        clonedProductImageContainer.lastElementChild.remove();
        clonedProductImageContainer.insertAdjacentHTML(
          "beforeend",
          `<img class="w-[32rem] rounded-xl" src="images/image-product-${currentProductImage}.jpg" alt="current product image">`
        );
        reusables.thumbnailSwitch(
          productThumbnailIndex,
          () => productThumbnailIndex[currentProductImage - 1]
        );
      });
    });
  });
});
