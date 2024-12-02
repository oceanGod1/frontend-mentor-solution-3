// Select Every Necessary Element
const selectedElemennts = {
  productID: document
    .querySelector("h1")
    .innerHTML.split(" ")
    .join("-")
    .toLocaleLowerCase(),
  productThumbnailIndex: Array.from(
    document.querySelectorAll(".thumbnail-cards figure")
  ),
  itemsAddedSuccessMessage: document.querySelector(
    ".item-added-success-message"
  ),
  increaseProductQuantity: document.querySelector(".increase-product-quantity"),
  reduceProductQuantity: document.querySelector(".reduce-product-quantity"),
  productImageContainer: document.querySelector(".product-image-container"),
  productImageSection: document.querySelector(".product-image-section"),
  activateImageClone: document.querySelector(".activate-image-clone"),
  gotoPreviousImage: document.querySelector(".go-to-previous-image"),
  closeMobileMenu: document.querySelector(".close-mobile-menu"),
  productQuantity: document.querySelector(".product-quantity"),
  openMobileMenu: document.querySelector(".open-mobile-menu"),
  gotoNextImage: document.querySelector(".go-to-next-image"),
  cartContent: document.querySelector(".cart-content"),
  menuCurtain: document.querySelector(".menu-curtain"),
  mobileMenu: document.querySelector(".mobile-menu"),
  addToCart: document.querySelector(".add-to-cart"),
  cartBadge: document.querySelector(".cart-badge"),
  cartIcon: document.querySelector(".cart-icon"),
  cartCard: document.querySelector(".cart-card"),
  backdrop: document.querySelector(".backdrop"),
};

// Select the Neccessary Cloned Elements
const clonedNodes = () => {
  const { backdrop } = selectedElemennts;
  return {
    clonedProductImageSection: backdrop.firstElementChild,
    closeFullScreenContainer: backdrop.firstElementChild.children[0],
    clonedProductImageContainer: backdrop.firstElementChild.children[1],
    clonedGotoNextImage: backdrop.firstElementChild.children[1].children[1],
    clonedProductThumbnailsContainer: backdrop.firstElementChild.children[2],
    closeFullScreen: backdrop.firstElementChild.children[0].firstElementChild,
    clonedGotoPreviousImage: backdrop.firstElementChild.children[1].children[0],
    clonedProductThumbnailIndex: Array.from(
      backdrop.firstElementChild.children[2].children
    ),
  };
};

// Define Every Initializer
const cartItems = {}; // This holds the total quantity and total cost for each item in the cart. the sum of all the quantities in this object is what will give you the value of the cartBadgeIndex function
let productQuantityIndex = 0; // Represents the number of products that you are adding to the cart each time you click on add to cart
let currentProductImageIndex = 1;

// Hold Every Reusable Function
const reusables = {
  // Toggle Mobile Menu
  toggleMobileMenu: (elem, action1, action2) => {
    const { mobileMenu, menuCurtain } = selectedElemennts;
    elem.addEventListener("click", function () {
      mobileMenu.classList[action1]("hidden");
      mobileMenu.classList.add("duration-300", "ease-in");
      menuCurtain.classList.add("-left-full", "duration-300", "ease-in");
      setTimeout(() => {
        menuCurtain.classList[action2]("left-[0vw]");
        mobileMenu.classList[action2]("bg-neutral2Light");
        setTimeout(() => {
          mobileMenu.classList.remove("duration-300", "ease-in");
          menuCurtain.classList.remove("-left-full", "duration-300", "ease-in");
        }, 500);
      }, 0);
    });
  },

  // Cart Badge State
  cartBadgeState: function () {
    const { cartBadge } = selectedElemennts;
    const cartBadgeIndex = () => {
      return Object.values(cartItems).reduce((accumulator, value) => {
        return accumulator + value.quantity;
      }, 0);
    };
    cartBadge.innerHTML = cartBadgeIndex();
    cartBadge.innerHTML != 0
      ? cartBadge.classList.remove("hidden")
      : cartBadge.classList.add("hidden");
  },

  // Product Image Card
  productImageCard: function (xPosition) {
    const { productImageContainer } = selectedElemennts;
    productImageContainer.insertAdjacentHTML(
      "beforeend",
      `<figure class="w-full h-full absolute top-0 ${xPosition} -z-10 duration-300", "ease-in"></figure>`
    );
  },

  // Translate currentProductImageIndex to Product an actual Background Image
  currentProductImage: function () {
    const { productImageContainer } = selectedElemennts;
    productImageContainer.lastElementChild.style.cssText += `background: url(images/image-product-${currentProductImageIndex}.jpg) center/cover`;
  },

  // Generate Product Image Card and Its Background Image
  productImageGen: function (xPosition) {
    this.productImageCard(xPosition);
    this.currentProductImage();
  },

  // Generate Product Image Card for Full Screen Mode (Image is not cropped as its background counterpart)
  fullScreenModeCurrentProductImage: function (xPosition) {
    const { backdrop } = selectedElemennts;
    if (backdrop.classList.contains("lg:grid")) {
      const { clonedProductImageContainer } = clonedNodes();
      clonedProductImageContainer.insertAdjacentHTML(
        "beforeend",
        `<img src="images/image-product-${currentProductImageIndex}.jpg" alt="current product image in full screen mode" class="w-[32rem] absolute top-0 ${xPosition} duration-300 ease-in">`
      );
    }
  },

  // Switch Thumbnail Highlight During Scroll
  highlightThumbnail: function (thumbnails, method) {
    thumbnails.filter((value) =>
      value !== method()
        ? value.classList.remove("before:absolute", "border-4")
        : value.classList.add("before:absolute", "border-4")
    );
  },

  // Scroll Through Images with the GoTo Buttons
  scrollProductImage: function (
    elem,
    method1,
    method2,
    generateImage,
    imageHolder,
    xPosition1,
    xPosition2,
    num,
    thumbnailArr,
    method3,
    generateTwinImage,
    method4
  ) {
    const { backdrop } = selectedElemennts;
    elem.addEventListener("click", () => {
      if (method1()) {
        method2();
        this[generateImage](xPosition1);
        setTimeout(() => {
          imageHolder.lastElementChild.classList.remove(xPosition1);
          imageHolder.lastElementChild.classList.add(xPosition2);
        }, 0);
        setTimeout(() => {
          imageHolder.children[num].remove();
        }, 500);
      }
      this.highlightThumbnail(
        thumbnailArr,
        () => thumbnailArr[currentProductImageIndex - 1]
      );

      if (backdrop.classList.contains("lg:grid")) {
        method3().lastElementChild.remove();
        this[generateTwinImage](xPosition2);
        this.highlightThumbnail(
          method4(),
          () => method4()[currentProductImageIndex - 1]
        );
      }
    });
  },

  // Disable and Enable the Product Image Scroll Buttons
  ableScrollButtons: (
    elem,
    num,
    siblingnum,
    sibling,
    twinElem,
    twinSibling
  ) => {
    const { backdrop } = selectedElemennts;
    elem.addEventListener("click", () => {
      currentProductImageIndex === num
        ? (elem.disabled = true)
        : (elem.disabled = false);
      currentProductImageIndex !== siblingnum ? (sibling.disabled = false) : "";
      if (backdrop.classList.contains("lg:grid")) {
        currentProductImageIndex === num
          ? (twinElem().disabled = true)
          : (twinElem.disabled = false);
        currentProductImageIndex !== siblingnum
          ? (twinSibling().disabled = false)
          : "";
      }
    });
  },

  // Highlight Product Image Scroll Buttons When Hovered Over
  highlightScrollButton: (elem, event, action) => {
    elem.addEventListener(event, () => {
      !elem.disabled
        ? elem.firstElementChild.classList[action]("filter-primary-filter")
        : elem.firstElementChild.classList.remove("filter-primary-filter");
    });
  },

  // Enable, Disable, and Highlight Scroll Buttons
  applyScrollButtonsUI: function (next, previous, twinNext, twinPrevious) {
    this.ableScrollButtons(next, 3, 2, previous, twinNext, twinPrevious);
    this.ableScrollButtons(previous, 2, 3, next, twinPrevious, twinNext);
    this.highlightScrollButton(next, "mouseenter", "add");
    this.highlightScrollButton(next, "mouseleave", "remove");
    this.highlightScrollButton(previous, "mouseenter", "add");
    this.highlightScrollButton(previous, "mouseleave", "remove");
  },

  // Scroll Through Images with the Thumbnails
  scrollWithThumbnail: function (
    elem,
    arr,
    reusableMethod,
    imageHolder,
    num,
    previous,
    next
  ) {
    elem.addEventListener("click", () => {
      currentProductImageIndex = arr.indexOf(elem) + 1;
      this[reusableMethod]("left-0");
      imageHolder.children[num].remove();
      this.highlightThumbnail(arr, () => arr[currentProductImageIndex - 1]);
      arr.indexOf(elem) === 0
        ? (previous.disabled = true)
        : (previous.disabled = false);
      arr.indexOf(elem) === arr.length - 1
        ? (next.disabled = true)
        : (next.disabled = false);
    });
  },

  // Set Product Quantity State
  countProduct: (elem, method1, method2) => {
    const { productQuantity } = selectedElemennts;
    elem.addEventListener("click", () => {
      if (method1()) {
        method2();
        productQuantity.value = productQuantityIndex;
      }
    });
  },

  // Dynamically create the cards that represent the items added to the cart
  newCartItem: () => {
    const { cartContent, productID } = selectedElemennts;
    cartItems[`${productID}`] = {};
    cartItems[`${productID}`].quantity = productQuantityIndex;
    cartItems[`${productID}`].totalCost =
      document.querySelector(".product-price span").innerHTML *
      cartItems[`${productID}`].quantity;
    cartContent.insertAdjacentHTML(
      "beforeend",
      `
      <div class="${productID} grid grid-cols-[auto_1fr_auto] grid-rows-[2rem_2rem] gap-x-4">
        <img src="images/image-product-1-thumbnail.jpg" alt="cart item" class="w-16 rounded-lg row-span-2">
        <h4 class="text-secondaryLight self-center text-sm text-nowrap">${
          document.querySelector("h1").innerHTML
        }</h4>
        <img src="images/icon-delete.svg" alt="delete item from cart" class="delete-cart-item row-span-2 self-center cursor-pointer">
        <div class="col-start-2 flex items-center">
          <span class="calculate-price text-secondaryLight self-center">${
            document.querySelector(".product-price").innerHTML
          } x ${cartItems[`${productID}`].quantity}</span>
          <span class="total-price-per-item pl-4 text-secondary font-bold">$${cartItems[
            `${productID}`
          ].totalCost.toPrecision(
            String(cartItems[`${productID}`].totalCost).length + 2
          )}</span>
        </div>
      </div>
      `
    );
    document
      .querySelector(".delete-cart-item")
      .addEventListener("click", (e) => {
        // console.log(e.target.parentElement.parentElement.childElementCount)
        if (e.target.parentElement.parentElement.childElementCount <= 2) {
          document
            .querySelector(".empty-cart-message")
            .classList.remove("hidden");
          document.querySelector(".checkout-button").remove();
        }
        delete cartItems[`${productID}`];
        e.target.parentElement.remove();
        reusables.cartBadgeState();
      });
  },

  // Success Message
  successMessage: function () {
    const { itemsAddedSuccessMessage } = selectedElemennts;
    itemsAddedSuccessMessage.classList.remove("hidden");
    setTimeout(() => {
      itemsAddedSuccessMessage.classList.remove("opacity-0");
    }, 0);
    setTimeout(() => {
      itemsAddedSuccessMessage.classList.add("opacity-0");
    }, 1000);
    setTimeout(() => {
      itemsAddedSuccessMessage.classList.add("hidden");
    }, 1300);
  },
};

// Default Displayed Product Image Using 'Translate currentProductIndex to background images'
const defaultUIOnLoad = (() => {
  const { productThumbnailIndex, gotoPreviousImage } = selectedElemennts;
  document.addEventListener("DOMContentLoaded", () => {
    reusables.productImageGen("left-0");
    reusables.highlightThumbnail(
      productThumbnailIndex,
      () => productThumbnailIndex[currentProductImageIndex - 1]
    );
    if ((currentProductImageIndex = 1)) {
      gotoPreviousImage.disabled = true;
    } else {
      gotoPreviousImage.disabled = false;
    }
  });
})();

// Toggle Cart card
const toggleCartCard = (() => {
  const { cartIcon, cartCard } = selectedElemennts;
  cartIcon.addEventListener("click", () => {
    cartCard.classList.toggle("hidden");
    cartCard.classList.toggle("grid");
  });
})();

// Apply Toggle Mobile Menu
const applyMobileMenuToggling = (() => {
  const { openMobileMenu, closeMobileMenu } = selectedElemennts;
  reusables.toggleMobileMenu(openMobileMenu, "remove", "add");
  reusables.toggleMobileMenu(closeMobileMenu, "add", "remove");
})();

// Apply Enable, Disable and Highlight Scroll Buttons
const applyScrollButtonsUI = (() => {
  const { gotoNextImage, gotoPreviousImage } = selectedElemennts;
  reusables.applyScrollButtonsUI(
    gotoNextImage,
    gotoPreviousImage,
    () => {
      // right here, I have to go through the backdrop, and not directly to the already established path for the clonedGoTo buttons, because once the cloned buttons are removed from their original parents and appended in the previousElementSibling of their parent. this is done, so that they can still be accessible, due to the z-index logic. In this light, the already established path no longer points to them.
      const { backdrop } = selectedElemennts;
      const clonedGotoNextImage =
        backdrop.firstElementChild.children[0].children[2];
      return clonedGotoNextImage;
    },
    () => {
      const { backdrop } = selectedElemennts;
      const clonedGotoPreviousImage =
        backdrop.firstElementChild.children[0].children[1];
      return clonedGotoPreviousImage;
    }
  );
})();

// Apply Scroll Through Images with the GoTo Buttons
const applyScrollWithGoToButtons = (() => {
  const {
    gotoNextImage,
    gotoPreviousImage,
    productImageContainer,
    productThumbnailIndex,
  } = selectedElemennts;
  reusables.scrollProductImage(
    gotoNextImage,
    () => currentProductImageIndex < 4,
    () => currentProductImageIndex++,
    "productImageGen",
    productImageContainer,
    "left-full",
    "left-0",
    2,
    productThumbnailIndex,
    () => {
      const { clonedProductImageContainer } = clonedNodes();
      return clonedProductImageContainer;
    },
    "fullScreenModeCurrentProductImage",
    () => {
      const { clonedProductThumbnailIndex } = clonedNodes();
      return clonedProductThumbnailIndex;
    }
  );

  reusables.scrollProductImage(
    gotoPreviousImage,
    () => currentProductImageIndex > 1,
    () => currentProductImageIndex--,
    "productImageGen",
    productImageContainer,
    "right-full",
    "right-0",
    2,
    productThumbnailIndex,
    () => {
      const { clonedProductImageContainer } = clonedNodes();
      return clonedProductImageContainer;
    },
    "fullScreenModeCurrentProductImage",
    () => {
      const { clonedProductThumbnailIndex } = clonedNodes();
      return clonedProductThumbnailIndex;
    }
  );
})();

// Apply Scroll Through Images using the Thumbnails
const applyScrollWithThumbnails = (() => {
  const {
    gotoNextImage,
    gotoPreviousImage,
    productThumbnailIndex,
    productImageContainer,
  } = selectedElemennts;
  productThumbnailIndex.forEach((thumbnail) => {
    reusables.scrollWithThumbnail(
      thumbnail,
      productThumbnailIndex,
      "productImageGen",
      productImageContainer,
      2,
      gotoPreviousImage,
      gotoNextImage
    );
  });
})();

// Every Clone Related Event
const { activateImageClone } = selectedElemennts;
activateImageClone.addEventListener("click", () => {
  // Clone the Product Image Section
  const { productImageSection, backdrop } = selectedElemennts;
  const clonedNode = productImageSection.cloneNode(true);
  backdrop.classList.add("lg:grid");
  backdrop.append(clonedNode);

  // Destructor the neccessary cloned elements to work with
  const {
    gotoNextImage,
    gotoPreviousImage,
    productImageContainer,
    productThumbnailIndex,
  } = selectedElemennts;
  const {
    clonedProductThumbnailIndex,
    closeFullScreenContainer,
    clonedProductThumbnailsContainer,
    clonedProductImageContainer,
    closeFullScreen,
    clonedProductImageSection,
    clonedGotoNextImage,
    clonedGotoPreviousImage,
  } = clonedNodes();

  // Style the Cloned Elements
  closeFullScreen.classList.add("lg:block");
  clonedGotoNextImage.classList.remove("lg:hidden");
  closeFullScreenContainer.classList.add("h-[35rem]");
  clonedGotoPreviousImage.classList.remove("lg:hidden");
  clonedProductImageContainer.firstElementChild.remove();
  reusables.fullScreenModeCurrentProductImage("left-0");
  clonedProductThumbnailsContainer.classList.add("px-10");
  clonedProductImageContainer.classList.add("lg:h-[32rem]");
  closeFullScreenContainer.append(clonedGotoPreviousImage, clonedGotoNextImage);
  clonedProductImageSection.classList.add(
    "lg:grid-rows-[auto_5.5rem]",
    "lg:h-[42rem]",
    "items-end"
  );

  // Close the Full-Screen Product Images
  closeFullScreen.addEventListener("click", () => {
    clonedNode.remove();
    backdrop.classList.remove("lg:grid");
  });

  // Apply Cloned Image Scroll Buttons UI
  reusables.applyScrollButtonsUI(
    clonedGotoNextImage,
    clonedGotoPreviousImage,
    () => gotoNextImage,
    () => gotoPreviousImage
  );

  // Scroll Product Images With Cloned Buttons
  reusables.scrollProductImage(
    clonedGotoNextImage,
    () => currentProductImageIndex < 4,
    () => currentProductImageIndex++,
    "fullScreenModeCurrentProductImage",
    clonedProductImageContainer,
    "left-full",
    "left-0",
    0,
    clonedProductThumbnailIndex,
    () => productImageContainer,
    "productImageGen",
    () => productThumbnailIndex
  );
  reusables.scrollProductImage(
    clonedGotoPreviousImage,
    () => currentProductImageIndex > 1,
    () => currentProductImageIndex--,
    "fullScreenModeCurrentProductImage",
    clonedProductImageContainer,
    "right-full",
    "right-0",
    0,
    clonedProductThumbnailIndex,
    () => productImageContainer,
    "productImageGen",
    () => productThumbnailIndex
  );

  // Scroll Product Images With Cloned Thumbnails
  clonedProductThumbnailIndex.forEach((thumbnail) => {
    reusables.scrollWithThumbnail(
      thumbnail,
      clonedProductThumbnailIndex,
      "fullScreenModeCurrentProductImage",
      clonedProductImageContainer,
      0,
      clonedGotoPreviousImage,
      clonedGotoNextImage
    );
    thumbnail.addEventListener("click", () => {
      reusables.productImageGen("left-0");
      productImageContainer.children[2].remove();
      reusables.highlightThumbnail(
        productThumbnailIndex,
        () => productThumbnailIndex[currentProductImageIndex - 1]
      );
      clonedProductThumbnailIndex.indexOf(thumbnail) === 0
        ? (gotoPreviousImage.disabled = true)
        : (gotoPreviousImage.disabled = false);
      clonedProductThumbnailIndex.indexOf(thumbnail) ===
      clonedProductThumbnailIndex.length - 1
        ? (gotoNextImage.disabled = true)
        : (gotoNextImage.disabled = false);
    });
  });
});

// Apply Product Quantity State
const applyProductQuantityState = (() => {
  const { increaseProductQuantity, reduceProductQuantity } = selectedElemennts;
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
})();

// Add to cart button on-click
const addToCartButtonOnClick = (() => {
  const { productQuantity, addToCart, cartContent, productID } =
    selectedElemennts;
  addToCart.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      productQuantity.value >= 1 &&
      !cartContent.classList.contains("not-empty")
    ) {
      document.querySelector(".empty-cart-message").classList.add("hidden");
      reusables.newCartItem();
      reusables.cartBadgeState();
      reusables.successMessage();
      cartContent.insertAdjacentHTML(
        "afterend",
        `<button class="checkout-button h-16 rounded-xl text-secondary font-bold bg-primary col-start-2">Checkout</button>`
      );
      cartContent.classList.add("not-empty");
    } else if (
      productQuantity.value >= 1 &&
      cartContent.classList.contains("not-empty") &&
      !cartItems[`${productID}`]
    ) {
      reusables.newCartItem();
      reusables.cartBadgeState();
      reusables.successMessage();
    } else if (
      productQuantity.value >= 1 &&
      cartContent.classList.contains("not-empty") &&
      cartItems[`${productID}`]
    ) {
      cartItems[`${productID}`].quantity += productQuantityIndex;
      cartItems[`${productID}`].totalCost =
        document.querySelector(".product-price span").innerHTML *
        cartItems[`${productID}`].quantity;
      document.querySelector(".calculate-price").innerHTML = `${
        document.querySelector(".product-price").innerHTML
      } x ${cartItems[`${productID}`].quantity}`;
      document.querySelector(".total-price-per-item").innerHTML = `$${cartItems[
        `${productID}`
      ].totalCost.toPrecision(
        String(cartItems[`${productID}`].totalCost).length + 2
      )}`;
      reusables.cartBadgeState();
      reusables.successMessage();
    }
    productQuantityIndex = 0;
    productQuantity.value = 0;
  });
})();
