// Select Every Necessary Element
const selectedElemennts = {
  productThumbnailIndex: Array.from(document.querySelectorAll(".thumbnail-cards figure")),
  increaseProductQuantity: document.querySelector(".increase-product-quantity"),
  reduceProductQuantity: document.querySelector(".reduce-product-quantity"),
  productImageContainer: document.querySelector(".product-image-container"),
  productImageSection: document.querySelector(".product-image-section"),
  activateImageClone: document.querySelector('.activate-image-clone'),
  gotoPreviousImage: document.querySelector(".go-to-previous-image"),
  closeMobileMenu: document.querySelector(".close-mobile-menu"),
  productQuantity: document.querySelector(".product-quantity"),
  openMobileMenu: document.querySelector(".open-mobile-menu"),
  cartCardHolder: document.querySelector(".cart-card-holder"),
  gotoNextImage: document.querySelector(".go-to-next-image"),
  cartContent: document.querySelector(".cart-content"),
  menuCutton: document.querySelector(".menu-cutton"),
  mobileMenu: document.querySelector(".mobile-menu"),
  addToCart: document.querySelector(".add-to-cart"),
  cartBadge: document.querySelector(".cart-badge"),
  cartCard: document.querySelector(".cart-card"),
  cartIcon: document.querySelector(".cart-icon"),
  backdrop: document.querySelector(".backdrop"),
}


// Select the Neccessary Cloned Elements
const clonedNodes = () =>{
  const {backdrop} = selectedElemennts;
  return {
    clonedProductImageSection: backdrop.firstElementChild,
    closeFullScreenContainer: backdrop.firstElementChild.children[0],
    closeFullScreen: backdrop.firstElementChild.children[0].firstElementChild,
    clonedProductImageContainer: backdrop.firstElementChild.children[1],
    clonedGotoPreviousImage: backdrop.firstElementChild.children[1].children[0],
    clonedGotoNextImage: backdrop.firstElementChild.children[1].children[1],
    clonedProductThumbnailsContainer: backdrop.firstElementChild.children[2],
    clonedProductThumbnailIndex: Array.from(backdrop.firstElementChild.children[2].children)
  }
}

// Define Every Initializer
let productQuantityIndex = 0;
let currentProductImageIndex = 1;
let cartBadgeIndex = 0;
let totalQuantityInCartIndex = 0;

// Hold Every Reusable Function
const reusables = {
  // Toggle Mobile Menu
  toggleMobileMenu: (elem, action1, action2) => {
    const {mobileMenu, menuCutton} = selectedElemennts;
    elem.addEventListener("click", function () {
      mobileMenu.classList[action1]("hidden");
      mobileMenu.classList.add("duration-300", "ease-in");
      menuCutton.classList.add("-left-full", "duration-300", "ease-in");
      setTimeout(() => {
        menuCutton.classList[action2]("left-[0vw]");
        mobileMenu.classList[action2]("bg-neutral2Light");
        setTimeout(() => {
          mobileMenu.classList.remove("duration-300", "ease-in");
          menuCutton.classList.remove("-left-full", "duration-300", "ease-in");
        }, 500);
      }, 0);
    });
  },

  // Toggle Cart Card
  toggleCartCard: (elem, method, toggle1, toggle2) => {
    elem.addEventListener("click", (e) => {
      method(e) && 
        cartCardHolder.classList[toggle1]("hidden");
        cartCardHolder.classList[toggle2]("grid");
    });
  },

  // Disable and Enable the Product Image Scroll Buttons
  ableScrollButtons: (elem, num, siblingnum, sibling, twinElem, twinSibling) => {
    const {backdrop} = selectedElemennts;
    elem.addEventListener('click', () => {
      currentProductImageIndex === num ? elem.disabled = true : elem.disabled = false;
      currentProductImageIndex !== siblingnum ? sibling.disabled = false : '';
      if(backdrop.classList.contains('lg:grid')){
        currentProductImageIndex === num ? twinElem().disabled = true : twinElem.disabled = false;
        currentProductImageIndex !== siblingnum ? twinSibling().disabled = false : '';        
      }
    })
  },

  // Hover Over the Product Image Scroll Buttons
  scrollButtonsHoverUI: (elem, event, action) => {
    elem.addEventListener(event, () => {
      !elem.disabled ? elem.firstElementChild.classList[action]("filter-primary-filter") : elem.firstElementChild.classList.remove("filter-primary-filter") ;
    })
  },

  applyScrollButtonsUI: function(next, previous, twinNext, twinPrevious){
    this.ableScrollButtons(next, 3, 2, previous, twinNext, twinPrevious)
    this.ableScrollButtons(previous, 2, 3, next, twinPrevious, twinNext)
    this.scrollButtonsHoverUI(next, 'mouseenter', 'add');
    this.scrollButtonsHoverUI(next, 'mouseleave', 'remove');
    this.scrollButtonsHoverUI(previous, 'mouseenter', 'add');
    this.scrollButtonsHoverUI(previous, 'mouseleave', 'remove');
  },

  // Product Image Card
  productImageCard: function (xPosition) {
    const {productImageContainer} = selectedElemennts;
    productImageContainer.insertAdjacentHTML("beforeend", `<figure class="w-full h-full absolute top-0 ${xPosition} -z-10 duration-300", "ease-in"></figure>`);
  },

  // Translate currentProductImageIndex to Product an actual Background Image
  currentProductImage: function () {
    const {productImageContainer} = selectedElemennts;
    productImageContainer.lastElementChild.style.cssText += `background: url(images/image-product-${currentProductImageIndex}.jpg) center/cover`;
  },
  
  // Generate Product Image Card and Its Background Image
  productImageGen: function (xPosition) {
    this.productImageCard(xPosition)
    this.currentProductImage()
  },
  
  // Generate Product Image Card for Full Screen Mode (Image is not cropped as its background counterpart)
  fullScreenModeCurrentProductImage: function (xPosition) {
    const {backdrop} = selectedElemennts;
    if (backdrop.classList.contains('lg:grid')) {
      const {clonedProductImageContainer} = clonedNodes()
      clonedProductImageContainer.insertAdjacentHTML("beforeend", `<img src="images/image-product-${currentProductImageIndex}.jpg" alt="current product image in full screen mode" class="w-[32rem] absolute top-0 ${xPosition} duration-300 ease-in">`);
    }
  },

  // Thumbnail Switch During Scroll
  highlightThumbnail: function (thumbnails, method) {
    thumbnails.filter((value) =>
      value !== method()
        ? value.classList.remove("before:absolute", "border-4")
        : value.classList.add("before:absolute", "border-4")
    );
  },

  // Scroll Through Images with the GoTo Buttons
  scrollProductImage: function(elem, method1, method2, generateImage, imageHolder, xPosition1, xPosition2, num, thumbnailArr, method3, generateTwinImage, method4) {
    const {backdrop} = selectedElemennts;
    elem.addEventListener("click", () => {
      if (method1()) {
        method2()
        this[generateImage](xPosition1)
        setTimeout(() => {
          imageHolder.lastElementChild.classList.remove(xPosition1)
          imageHolder.lastElementChild.classList.add(xPosition2)
        },0);
        setTimeout(() => {
          imageHolder.children[num].remove()
        },500)
      }
      this.highlightThumbnail(thumbnailArr, () => thumbnailArr[currentProductImageIndex - 1]);
      
      if (backdrop.classList.contains('lg:grid')) {
        method3().lastElementChild.remove()
        this[generateTwinImage](xPosition2)
        this.highlightThumbnail(method4(), () => method4()[currentProductImageIndex - 1]);
      }
    });
  },

  // Scroll Through Images with the Thumbnails
  scrollWithThumbnail: function (elem, arr, reusableMethod, imageHolder, num){
    elem.addEventListener('click', () => {
      currentProductImageIndex = arr.indexOf(elem) + 1;
      this[reusableMethod]('left-0');
      imageHolder.children[num].remove()
      this.highlightThumbnail(arr, () => arr[currentProductImageIndex - 1]);
      arr.indexOf(elem) === 0 ? gotoPreviousImage.disabled = true : gotoPreviousImage.disabled = false;
      arr.indexOf(elem) === arr.length - 1 ? gotoNextImage.disabled = true : gotoNextImage.disabled = false;
      // elem.classList.contains('lg:hidden') ? '' : this.highlightThumbnail(arr, () => arr[currentProductImageIndex - 1])
    })
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

// Default Displayed Product Image Using 'Translate currentProductIndex to background images'
const {productThumbnailIndex, gotoPreviousImage, gotoNextImage, productImageContainer} = selectedElemennts;
document.addEventListener("DOMContentLoaded", () => {
  reusables.productImageGen('left-0')
  reusables.highlightThumbnail(productThumbnailIndex, () => productThumbnailIndex[currentProductImageIndex - 1]);
  if (currentProductImageIndex = 1) {
    gotoPreviousImage.disabled = true;
  } else {
    gotoPreviousImage.disabled = false;
  }
});

// Apply Toggle Mobile Menu
const {openMobileMenu, closeMobileMenu} = selectedElemennts;
reusables.toggleMobileMenu(openMobileMenu, "remove", "add");
reusables.toggleMobileMenu(closeMobileMenu, "add", "remove");

// Apply Toggle Cart card
const {cartIcon, cartCardHolder} = selectedElemennts;
reusables.toggleCartCard(cartIcon, (e) => e.target, "remove", "add");
reusables.toggleCartCard(cartCardHolder, (e) => e.target === cartCardHolder, "add", "remove");

// Apply Image Scroll Buttons UI
reusables.applyScrollButtonsUI(gotoNextImage, gotoPreviousImage, () =>{
  // right here, closeFullScreenContainer is selected and not gotoprevious or gotonext, because they are programmed in such a way that; once the clone is activated, they have adopt a new parent element, which is this selected one, consiquently, they can no longer be selected, using the path declared in the clonedNodes function above
  const {closeFullScreenContainer} = clonedNodes();
  console.log(closeFullScreenContainer.children[1])
  return closeFullScreenContainer.children[1]
}, () => {
  const {closeFullScreenContainer} = clonedNodes();
  console.log(closeFullScreenContainer.lastElementChild)
  return closeFullScreenContainer.children[2]
})

// Apply Scroll Through Images with the GoTo Buttons
reusables.scrollProductImage(gotoNextImage, () => currentProductImageIndex < 4, () => currentProductImageIndex++, 'productImageGen', productImageContainer, 'left-full', 'left-0', 2, productThumbnailIndex, () => {
  const {clonedProductImageContainer} = clonedNodes();
  return clonedProductImageContainer;
},
'fullScreenModeCurrentProductImage', () => {
  const {clonedProductThumbnailIndex} = clonedNodes();
  return clonedProductThumbnailIndex
})

reusables.scrollProductImage(gotoPreviousImage, () => currentProductImageIndex > 1, () => currentProductImageIndex--, 'productImageGen', productImageContainer, 'right-full', 'right-0', 2, productThumbnailIndex, () => {
  const {clonedProductImageContainer} = clonedNodes();
  return clonedProductImageContainer;
},
'fullScreenModeCurrentProductImage', () => {
  const {clonedProductThumbnailIndex} = clonedNodes();
  return clonedProductThumbnailIndex
})


// function connectScrolButtons(elem) {
//   elem.addEventListener('click', () => {
//     reusables.fullScreenModeCurrentProductImage('left-0');
//   })
//   reusables.ableScrollButtons()
// }
// // ableScrollButtons: (elem, num, siblingnum, sibling) => {

// connectScrolButtons(gotoNextImage)
// connectScrolButtons(gotoPreviousImage)



// Apply Scroll Through Images using the Thumbnails
productThumbnailIndex.forEach(thumbnail => {
  reusables.scrollWithThumbnail(thumbnail, productThumbnailIndex, 'productImageGen', productImageContainer, 2);
});

// Every Clone Related Event
const {activateImageClone} = selectedElemennts;
activateImageClone.addEventListener('click', () => {
  
  // Clone the Product Image Section
  const {productImageSection, backdrop} = selectedElemennts;
  const clonedNode = productImageSection.cloneNode(true)
  backdrop.classList.add('lg:grid');
  backdrop.append(clonedNode);

  // Destructor the neccessary cloned elements to work with
  const {clonedProductThumbnailIndex, closeFullScreenContainer, clonedProductThumbnailsContainer, clonedProductImageContainer, closeFullScreen, clonedProductImageSection, clonedGotoNextImage, clonedGotoPreviousImage} = clonedNodes();

  // Style the Cloned Elements
  closeFullScreen.classList.add('lg:block');
  clonedGotoNextImage.classList.remove('lg:hidden');
  closeFullScreenContainer.classList.add('h-[35rem]');
  clonedGotoPreviousImage.classList.remove('lg:hidden');
  clonedProductImageContainer.firstElementChild.remove();
  reusables.fullScreenModeCurrentProductImage('left-0');
  clonedProductThumbnailsContainer.classList.add('px-10');
  clonedProductImageContainer.classList.add('lg:h-[32rem]')
  closeFullScreenContainer.append(clonedGotoPreviousImage, clonedGotoNextImage);
  clonedProductImageSection.classList.add('lg:grid-rows-[auto_5.5rem]', 'lg:h-[42rem]', 'items-end')
  
  // Close the Full-Screen Product Images
  closeFullScreen.addEventListener('click', () => {
    clonedNode.remove()
    backdrop.classList.remove('lg:grid');
  })

  // Apply Cloned Image Scroll Buttons UI
  reusables.applyScrollButtonsUI(clonedGotoNextImage, clonedGotoPreviousImage, () => gotoNextImage, () => gotoPreviousImage)
  
  // Scroll Product Images With Cloned Buttons
  reusables.scrollProductImage(clonedGotoNextImage, () => currentProductImageIndex < 4, () => currentProductImageIndex++, 'fullScreenModeCurrentProductImage', clonedProductImageContainer, 'left-full', 'left-0', 0, clonedProductThumbnailIndex, () => productImageContainer, 'productImageGen', () => productThumbnailIndex)
  reusables.scrollProductImage(clonedGotoPreviousImage, () => currentProductImageIndex > 1, () => currentProductImageIndex--, 'fullScreenModeCurrentProductImage', clonedProductImageContainer, 'right-full', 'right-0', 0, clonedProductThumbnailIndex, () => productImageContainer, 'productImageGen', () => productThumbnailIndex)
  



  
  clonedGotoNextImage.addEventListener('click', () => {
    if(currentProductImageIndex <= 4) {
      reusables.productImageGen('left-0')
    }
  })
  clonedGotoPreviousImage.addEventListener('click', () => {
    if(currentProductImageIndex > 0) {
      reusables.productImageGen('left-0')
    }
  })

  // Scroll Product Images With Cloned Thumbnails
  clonedProductThumbnailIndex.forEach(thumbnail => {
    reusables.scrollWithThumbnail(thumbnail, clonedProductThumbnailIndex, 'fullScreenModeCurrentProductImage', clonedProductImageContainer, 0);
  });
});

// Apply Product Quantity State
reusables.countProduct(increaseProductQuantity, () => productQuantityIndex >= 0, () => productQuantityIndex++);
reusables.countProduct(reduceProductQuantity, () => productQuantityIndex >= 1, () => productQuantityIndex--);

// Add to cart button on-click
addToCart.addEventListener("submit", (e) => {
  e.preventDefault();
  if (productQuantity.value >= 1 && !cartContent.classList.contains("not-empty")) {
    document.querySelector(".empty-cart-message").classList.add("hidden");
    cartContent.classList.add("not-empty");
    reusables.addedItemtoCart();
    reusables.cartBadge();
  } else if (productQuantity.value >= 1 && cartContent.classList.contains("not-empty")) {
    reusables.cartBadge();
    totalQuantityInCartIndex = Number(totalQuantityInCartIndex) + Number(productQuantity.value);
    const totalAmount = document.querySelector(".product-price span").innerHTML * totalQuantityInCartIndex;
    document.querySelector(".calculate-price").innerHTML = `${document.querySelector(".product-price").innerHTML} x ${totalQuantityInCartIndex}`;
    document.querySelector(".total-price").innerHTML = `$${totalAmount.toPrecision(String(totalAmount).length + 2)}`;
  }
  productQuantityIndex = 0;
  productQuantity.value = 0;
});













































// // // Select every necessary element
// // const productThumbnailIndex = Array.from(document.querySelectorAll(".thumbnail-cards figure"));
// // const increaseProductQuantity = document.querySelector(".increase-product-quantity");
// // const reduceProductQuantity = document.querySelector(".reduce-product-quantity");
// // const productImageContainer = document.querySelector(".product-image-container");
// // const productImageSection = document.querySelector(".product-image-section");
// // const activateImageClone = document.querySelector('.activate-image-clone');
// // const gotoPreviousImage = document.querySelector(".go-to-previous-image");
// // const closeMobileMenu = document.querySelector(".close-mobile-menu");
// // const productQuantity = document.querySelector(".product-quantity");
// // const openMobileMenu = document.querySelector(".open-mobile-menu");
// // const cartCardHolder = document.querySelector(".cart-card-holder");
// // const gotoNextImage = document.querySelector(".go-to-next-image");
// // const cartContent = document.querySelector(".cart-content");
// // const menuCutton = document.querySelector(".menu-cutton");
// // const mobileMenu = document.querySelector(".mobile-menu");
// // const addToCart = document.querySelector(".add-to-cart");
// // const cartBadge = document.querySelector(".cart-badge");
// // const cartCard = document.querySelector(".cart-card");
// // const cartIcon = document.querySelector(".cart-icon");
// // const backdrop = document.querySelector(".backdrop");


// const selectedElemennts = {
//   productThumbnailIndex: Array.from(document.querySelectorAll(".thumbnail-cards figure")),
//   increaseProductQuantity: document.querySelector(".increase-product-quantity"),
//   reduceProductQuantity: document.querySelector(".reduce-product-quantity"),
//   productImageContainer: document.querySelector(".product-image-container"),
//   productImageSection: document.querySelector(".product-image-section"),
//   activateImageClone: document.querySelector('.activate-image-clone'),
//   gotoPreviousImage: document.querySelector(".go-to-previous-image"),
//   closeMobileMenu: document.querySelector(".close-mobile-menu"),
//   productQuantity: document.querySelector(".product-quantity"),
//   openMobileMenu: document.querySelector(".open-mobile-menu"),
//   cartCardHolder: document.querySelector(".cart-card-holder"),
//   gotoNextImage: document.querySelector(".go-to-next-image"),
//   cartContent: document.querySelector(".cart-content"),
//   menuCutton: document.querySelector(".menu-cutton"),
//   mobileMenu: document.querySelector(".mobile-menu"),
//   addToCart: document.querySelector(".add-to-cart"),
//   cartBadge: document.querySelector(".cart-badge"),
//   cartCard: document.querySelector(".cart-card"),
//   cartIcon: document.querySelector(".cart-icon"),
//   backdrop: document.querySelector(".backdrop"),
// }

// const clonedNodes = () =>{
//   return {
//     clonedProductImageSection: backdrop.firstElementChild,
//     closeFullScreenContainer: backdrop.firstElementChild.children[0],
//     closeFullScreen: backdrop.firstElementChild.children[0].firstElementChild,
//     clonedProductImageContainer: backdrop.firstElementChild.children[1],
//     clonedGotoPreviousImage: backdrop.firstElementChild.children[1].children[0],
//     clonedGotoNextImage: backdrop.firstElementChild.children[1].children[1],
//     clonedProductThumbnailsContainer: backdrop.firstElementChild.children[2],
//     clonedProductThumbnailIndex: Array.from(backdrop.firstElementChild.children[2].children)
//   }
// }




// // Define Every Initializer
// let productQuantityIndex = 0;
// let currentProductImageIndex = 1;
// let cartBadgeIndex = 0;
// let totalQuantityInCartIndex = 0;

// // Hold Every Reusable Function
// const reusables = {
//   // Toggle Mobile Menu
//   toggleMobileMenu: (elem, action1, action2) => {
//     elem.addEventListener("click", function () {
//       mobileMenu.classList[action1]("hidden");
//       mobileMenu.classList.add("duration-300", "ease-in");
//       menuCutton.classList.add("-left-full", "duration-300", "ease-in");
//       setTimeout(() => {
//         menuCutton.classList[action2]("left-[0vw]");
//         mobileMenu.classList[action2]("bg-neutral2Light");
//         setTimeout(() => {
//           mobileMenu.classList.remove("duration-300", "ease-in");
//           menuCutton.classList.remove("-left-full", "duration-300", "ease-in");
//         }, 500);
//       }, 0);
//     });
//   },

//   // Toggle Cart Card
//   toggleCartCard: (elem, method, toggle1, toggle2) => {
//     elem.addEventListener("click", (e) => {
//       method(e) && 
//         cartCardHolder.classList[toggle1]("hidden");
//         cartCardHolder.classList[toggle2]("grid");
//     });
//   },

//   // Disable and Enable the Product Image Scroll Buttons
//   ableScrollButtons: (elem, num, siblingnum, sibling) => {
//     elem.addEventListener('click', () => {
//       currentProductImageIndex === num ? elem.disabled = true : elem.disabled = false;
//       currentProductImageIndex !== siblingnum ? sibling.disabled = false : '';
//     })
//   },

//   // Hover Over the Product Image Scroll Buttons
//   scrollButtonsHoverUI: (elem, event, action) => {
//     elem.addEventListener(event, () => {
//       !elem.disabled ? elem.firstElementChild.classList[action]("filter-primary-filter") : elem.firstElementChild.classList.remove("filter-primary-filter") ;
//     })
//   },

//   applyScrollButtonsUI: function(next, previous){
//     this.ableScrollButtons(next, 3, 2, previous)
//     this.ableScrollButtons(previous, 2, 3, next)
//     this.scrollButtonsHoverUI(next, 'mouseenter', 'add');
//     this.scrollButtonsHoverUI(next, 'mouseleave', 'remove');
//     this.scrollButtonsHoverUI(previous, 'mouseenter', 'add');
//     this.scrollButtonsHoverUI(previous, 'mouseleave', 'remove');
//   },

//   // Product Image Card
//   productImageCard: function (xPosition) {
//     productImageContainer.insertAdjacentHTML("beforeend", `<figure class="w-full h-full absolute top-0 ${xPosition} -z-10 duration-300", "ease-in"></figure>`);
//   },

//   // Translate currentProductImageIndex to Product an actual Background Image
//   currentProductImage: function () {
//     productImageContainer.lastElementChild.style.cssText += `background: url(images/image-product-${currentProductImageIndex}.jpg) center/cover`;
//   },
  
//   // Generate Product Image Card and Its Background Image
//   productImageGen: function (xPosition) {
//     this.productImageCard(xPosition)
//     this.currentProductImage()
//   },
  
//   // Generate Product Image Card for Full Screen Mode (Image is not cropped as its background counterpart)
//   fullScreenModeCurrentProductImage: function (xPosition) {
//     if (backdrop.classList.contains('lg:grid')) {
//       const clonedProductImageContainer = backdrop.firstElementChild.children[1]
//       clonedProductImageContainer.insertAdjacentHTML("beforeend", `<img src="images/image-product-${currentProductImageIndex}.jpg" alt="current product image in full screen mode" class="w-[32rem] absolute top-0 ${xPosition} duration-300 ease-in">`);
//     }
//   },

//   // Thumbnail Switch During Scroll
//   highlightThumbnail: function (thumbnails, method) {
//     thumbnails.filter((value) =>
//       value !== method()
//         ? value.classList.remove("before:absolute", "border-4")
//         : value.classList.add("before:absolute", "border-4")
//     );
//   },

//   // Scroll Through Images with the GoTo Buttons
//   scrollProductImage: function(elem, method1, method2, reusableMethod, imageHolder, xPosition1, xPosition2, num, thumbnailArr, clonedThumbnailArr) {
//     elem.addEventListener("click", () => {
//       if (method1()) {
//         method2()
//         this[reusableMethod](xPosition1)
//         setTimeout(() => {
//           imageHolder.lastElementChild.classList.remove(xPosition1)
//           imageHolder.lastElementChild.classList.add(xPosition2)
//         },0);
//         setTimeout(() => {
//           imageHolder.children[num].remove()
//         },500)
//       }
//       this.highlightThumbnail(thumbnailArr, () => thumbnailArr[currentProductImageIndex - 1]);
//       elem.classList.contains('lg:hidden') ? '' : this.highlightThumbnail(clonedThumbnailArr, () => clonedThumbnailArr[currentProductImageIndex - 1])
//     });
//   },

//   // Scroll Through Images with the Thumbnails
//   scrollWithThumbnail: function (elem, arr, reusableMethod, imageHolder, num){
//     elem.addEventListener('click', () => {
//       currentProductImageIndex = arr.indexOf(elem) + 1;
//       this[reusableMethod]('left-0');
//       imageHolder.children[num].remove()
//       this.highlightThumbnail(arr, () => arr[currentProductImageIndex - 1]);
//       arr.indexOf(elem) === 0 ? gotoPreviousImage.disabled = true : gotoPreviousImage.disabled = false;
//       arr.indexOf(elem) === arr.length - 1 ? gotoNextImage.disabled = true : gotoNextImage.disabled = false;
//       // elem.classList.contains('lg:hidden') ? '' : this.highlightThumbnail(arr, () => arr[currentProductImageIndex - 1])
//     })
//   },
 
//   // Set Product Quantity State
//   countProduct: (elem, method1, method2) => {
//     elem.addEventListener("click", () => {
//       if (method1()) {
//         method2();
//         productQuantity.value = productQuantityIndex;
//       }
//     });
//   },

//   // Cart Badge State and success notification
//   cartBadge: () => {
//     cartBadgeIndex = cartBadgeIndex + productQuantityIndex;
//     cartBadge.innerHTML = cartBadgeIndex;
//     cartBadge.classList.remove("hidden");

//     setTimeout(() => {
//       document.querySelector(".item-added-success-message").remove();
//     }, 1000);
//   },

//   // Dynamically create the cards that represent the items added to the cart
//   addedItemtoCart: () => {
//     const totalAmount =
//       document.querySelector(".product-price span").innerHTML *
//       productQuantity.value;
//     totalQuantityInCartIndex = productQuantityIndex;
//     cartContent.insertAdjacentHTML(
//       "beforeend",
//       `
//       <div class="cart-item grid grid-cols-[auto_1fr_auto] grid-rows-[2rem_2rem] gap-x-4">
//         <img src="images/image-product-1-thumbnail.jpg" alt="cart item" class="w-16 rounded-lg row-span-2">
//         <h4 class="text-secondaryLight self-center text-sm text-nowrap">${
//           document.querySelector("h1").innerHTML
//         }</h4>
//         <img src="images/icon-delete.svg" alt="delete item from cart" class="delete-cart-item row-span-2 self-center">
//         <div class="col-start-2 flex items-center">
//           <span class="calculate-price text-secondaryLight self-center">${
//             document.querySelector(".product-price").innerHTML
//           } x ${totalQuantityInCartIndex}</span>
//           <span class="total-price pl-4 text-secondary font-bold">$${totalAmount.toPrecision(
//             String(totalAmount).length + 2
//           )}</span>
//         </div>
//       </div>
//       <button class="h-16 rounded-xl text-secondary font-bold bg-primary">Checkout</button>
//       `
//     );
//   },
// };

// gotoNextImage.addEventListener('click', () => {
//   console.log(backdrop)
// })


// // Default Displayed Product Image Using 'Translate currentProductIndex to background images'
// document.addEventListener("DOMContentLoaded", () => {
//   reusables.productImageGen('left-0')
//   reusables.highlightThumbnail(productThumbnailIndex, () => productThumbnailIndex[currentProductImageIndex - 1]);
//   if (currentProductImageIndex = 1) {
//     gotoPreviousImage.disabled = true;
//   } else {
//     gotoPreviousImage.disabled = false;
//   }
// });

// // Apply Toggle Mobile Menu
// reusables.toggleMobileMenu(openMobileMenu, "remove", "add");
// reusables.toggleMobileMenu(closeMobileMenu, "add", "remove");

// // Apply Toggle Cart card
// reusables.toggleCartCard(cartIcon, (e) => e.target, "remove", "add");
// reusables.toggleCartCard(cartCardHolder, (e) => e.target === cartCardHolder, "add", "remove");

// // Apply Image Scroll Buttons UI
// reusables.applyScrollButtonsUI(gotoNextImage, gotoPreviousImage)

// // Apply Scroll Through Images with the GoTo Buttons
// reusables.scrollProductImage(gotoNextImage, () => currentProductImageIndex < 4, () => currentProductImageIndex++, 'productImageGen', productImageContainer, 'left-full', 'left-0', 2, productThumbnailIndex)
// reusables.scrollProductImage(gotoPreviousImage, () => currentProductImageIndex > 1, () => currentProductImageIndex--, 'productImageGen', productImageContainer, 'right-full', 'right-0', 2, productThumbnailIndex)

// // function connectScrolButtons(elem) {
// //   elem.addEventListener('click', () => {
// //     reusables.fullScreenModeCurrentProductImage('left-0');
// //   })
// //   reusables.ableScrollButtons()
// // }
// // // ableScrollButtons: (elem, num, siblingnum, sibling) => {

// // connectScrolButtons(gotoNextImage)
// // connectScrolButtons(gotoPreviousImage)



// // Apply Scroll Through Images using the Thumbnails
// productThumbnailIndex.forEach(thumbnail => {
//   reusables.scrollWithThumbnail(thumbnail, productThumbnailIndex, 'productImageGen', productImageContainer, 2);
// });

// // Clone the Product Image Section
// activateImageClone.addEventListener('click', () => {
//   const clonedNode = productImageSection.cloneNode(true)
//   backdrop.classList.add('lg:grid');
//   backdrop.append(clonedNode);

//   // Select the Cloned Elements
//   const clonedProductImageSection = backdrop.firstElementChild;
//   const closeFullScreenContainer = clonedProductImageSection.children[0];
//   const closeFullScreen = closeFullScreenContainer.firstElementChild;
//   const clonedProductImageContainer = clonedProductImageSection.children[1];
//   const clonedGotoPreviousImage = clonedProductImageContainer.children[0]
//   const clonedGotoNextImage = clonedProductImageContainer.children[1];
//   const clonedProductThumbnailsContainer = clonedProductImageSection.children[2];
//   const clonedProductThumbnailIndex = Array.from(clonedProductThumbnailsContainer.children);

//   // Style the Cloned Elements
//   clonedProductImageSection.classList.add('lg:grid-rows-[auto_5.5rem]', 'lg:h-[42rem]', 'items-end')
//   closeFullScreenContainer.classList.add('h-[35rem]');
//   closeFullScreenContainer.append(clonedGotoPreviousImage, clonedGotoNextImage);
//   closeFullScreen.classList.add('lg:block');
//   clonedProductImageContainer.classList.add('lg:h-[32rem]')
//   clonedProductImageContainer.firstElementChild.remove();
//   reusables.fullScreenModeCurrentProductImage('left-0');
//   clonedProductThumbnailsContainer.classList.add('px-10');
//   clonedGotoNextImage.classList.remove('lg:hidden');
//   clonedGotoPreviousImage.classList.remove('lg:hidden');

//   // Close the Full-Screen Product Images
//   closeFullScreen.addEventListener('click', () => {
//     clonedNode.remove()
//     backdrop.classList.remove('lg:grid');
//   })

//   // Scroll Product Images With Cloned Buttons
//   reusables.applyScrollButtonsUI(clonedGotoNextImage, clonedGotoPreviousImage)
//   reusables.scrollProductImage(clonedGotoNextImage, () => currentProductImageIndex < 4, () => currentProductImageIndex++, 'fullScreenModeCurrentProductImage', clonedProductImageContainer, 'left-full', 'left-0', 0, productThumbnailIndex, clonedProductThumbnailIndex)
//   reusables.scrollProductImage(clonedGotoPreviousImage, () => currentProductImageIndex > 1, () => currentProductImageIndex--, 'fullScreenModeCurrentProductImage', clonedProductImageContainer, 'right-full', 'right-0', 0, productThumbnailIndex, clonedProductThumbnailIndex)
  
//   clonedGotoNextImage.addEventListener('click', () => {
//     if(currentProductImageIndex <= 4) {
//       reusables.productImageGen('left-0')
//     }
//   })
//   clonedGotoPreviousImage.addEventListener('click', () => {
//     if(currentProductImageIndex > 0) {
//       reusables.productImageGen('left-0')
//     }
//   })

//   // Scroll Product Images With Cloned Thumbnails
//   clonedProductThumbnailIndex.forEach(thumbnail => {
//     reusables.scrollWithThumbnail(thumbnail, clonedProductThumbnailIndex, 'fullScreenModeCurrentProductImage', clonedProductImageContainer, 0);
//   });
// });

// // Apply Product Quantity State
// reusables.countProduct(increaseProductQuantity, () => productQuantityIndex >= 0, () => productQuantityIndex++);
// reusables.countProduct(reduceProductQuantity, () => productQuantityIndex >= 1, () => productQuantityIndex--);

// // Add to cart button on-click
// addToCart.addEventListener("submit", (e) => {
//   e.preventDefault();
//   if (productQuantity.value >= 1 && !cartContent.classList.contains("not-empty")) {
//     document.querySelector(".empty-cart-message").classList.add("hidden");
//     cartContent.classList.add("not-empty");
//     reusables.addedItemtoCart();
//     reusables.cartBadge();
//   } else if (productQuantity.value >= 1 && cartContent.classList.contains("not-empty")) {
//     reusables.cartBadge();
//     totalQuantityInCartIndex = Number(totalQuantityInCartIndex) + Number(productQuantity.value);
//     const totalAmount = document.querySelector(".product-price span").innerHTML * totalQuantityInCartIndex;
//     document.querySelector(".calculate-price").innerHTML = `${document.querySelector(".product-price").innerHTML} x ${totalQuantityInCartIndex}`;
//     document.querySelector(".total-price").innerHTML = `$${totalAmount.toPrecision(String(totalAmount).length + 2)}`;
//   }
//   productQuantityIndex = 0;
//   productQuantity.value = 0;
// });

