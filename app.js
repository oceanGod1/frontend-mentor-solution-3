// Select every necessary element
const increaseProductQuantity = document.querySelector('.increase-product-quantity');
const reduceProductQuantity = document.querySelector('.reduce-product-quantity');
const gotoPreviousImage = document.querySelector('.go-to-previous-image');
const closeMobileMenu = document.querySelector('.close-mobile-menu');
const productQuantity = document.querySelector('.product-quantity');
const openMobileMenu = document.querySelector('.open-mobile-menu');
const cartCardHolder = document.querySelector('.cart-card-holder');
const gotoNextImage = document.querySelector('.go-to-next-image');
const cartContent = document.querySelector('.cart-content');
const productImage = document.querySelectorAll('.product');
const mobileMenu = document.querySelector('.mobile-menu');
const addToCart = document.querySelector('.add-to-cart');
const cartBadge = document.querySelector('.cart-badge');
const cartCard = document.querySelector('.cart-card');
const cartIcon = document.querySelector('.cart-icon');

const productImageArray = Array.from(productImage)

let productQuantityIndex = 0;
let currentProductImage = 0;
let cartBadgeIndex = 0;
let totalQuantityInCartIndex = 0;


// Hold all resuable functions
const reusables = {
  // Toggle Mobile Menu
  toggleMobileMenu: (elem, action) => {
    elem.addEventListener('click', () => {
      mobileMenu.classList[action]('hidden')
    })
  },

  // Toggle Cart
  toggleCartCard: (elem, method, toggle1, toggle2) => {
    elem.addEventListener('click', (e) => {
      if (method(e)) {
        cartCardHolder.classList[toggle1]('hidden')
        cartCardHolder.classList[toggle2]('grid')
      }
    })
  },

  // Product Image Scrolling
  productImageGen: (elem, method1, class1, method2, class2, method3) => {
    elem.addEventListener('click', () => {
      if (method1()) {
        productImageArray[currentProductImage].classList.add(class1)
        productImageArray[method2()].classList.remove(class2)
        method3()
      }
    })
  },

  // Set Product Quantity State
  countProduct: (elem, method1, method2) => {
    elem.addEventListener('click', () => {
      if (method1()) {
        method2();
        productQuantity.value = productQuantityIndex;
      }
    })
  },

  // Cart Badge State and success notification
  cartBadge: () => {
    cartBadgeIndex = cartBadgeIndex + productQuantityIndex;
    cartBadge.innerHTML = cartBadgeIndex;
    cartBadge.classList.remove('hidden');

    document.body.insertAdjacentHTML('beforeend', `
      <div class="item-added-success-message w-screen fixed top-20 z-20">
        <p class="w-4/5 m-auto p-4 rounded-lg text-center text-neutral1 text-[clamp(5vw calc(1rem + 2vw))] font-bold bg-green-600">Item successfully added to cart</p>
      </div>`
    );
    setTimeout(() => {
      document.querySelector('.item-added-success-message').remove()
    }, 1000);
  },

  // Dynamically create the cards that represent the items added to the cart
  addedItemtoCart: () => {
    const totalAmount = document.querySelector('.product-price span').innerHTML * productQuantity.value;
    totalQuantityInCartIndex = productQuantityIndex;
    cartContent.insertAdjacentHTML('beforeend', `
      <div class="cart-item grid grid-cols-[auto_1fr_auto] grid-rows-[2rem_2rem] gap-x-4">
        <img src="images/image-product-1-thumbnail.jpg" alt="cart item" class="w-16 rounded-lg row-span-2">
        <h4 class="text-secondaryLight self-center text-sm text-nowrap">${document.querySelector('h1').innerHTML}</h4>
        <img src="images/icon-delete.svg" alt="delete item from cart" class="delete-cart-item row-span-2 self-center">
        <div class="col-start-2 flex items-center">
        <span class="calculate-price text-secondaryLight self-center">${document.querySelector('.product-price').innerHTML} x ${totalQuantityInCartIndex}</span>
        <span class="total-price pl-4 text-secondary font-bold">$${totalAmount.toPrecision(String(totalAmount).length + 2)}</span>
        </div>
      </div>
      <button class="h-16 rounded-xl text-secondary font-bold bg-primary">Checkout</button>`
    )
  }
}


// Apply Toggle Mobile Menu
reusables.toggleMobileMenu(openMobileMenu, 'remove');
reusables.toggleMobileMenu(closeMobileMenu, 'add');

// Apply Toggle Cart card
reusables.toggleCartCard(cartIcon, (e) => e.target, 'remove', 'add')
reusables.toggleCartCard(cartCardHolder, (e) => e.target === cartCardHolder, 'add', 'remove')

// Apply Product Image Scrolling
reusables.productImageGen(gotoNextImage, () => currentProductImage < productImageArray.length - 1, 'left-full', () => currentProductImage + 1, 'right-full', () => currentProductImage++)
reusables.productImageGen(gotoPreviousImage, () => currentProductImage > 0, 'right-full', () => currentProductImage - 1, 'left-full', () => currentProductImage--)

// Apply Product Quantity State
reusables.countProduct(increaseProductQuantity, () => productQuantityIndex >= 0, () => productQuantityIndex++);
reusables.countProduct(reduceProductQuantity, () => productQuantityIndex >= 1, () => productQuantityIndex--);

// Add to cart button on-click
addToCart.addEventListener('submit', (e) => {
  e.preventDefault();

  if (productQuantity.value >= 1 && !cartContent.classList.contains('not-empty')) {
    document.querySelector('.empty-cart-message').classList.add('hidden')
    cartContent.classList.add('not-empty')
    reusables.addedItemtoCart()
    reusables.cartBadge()
  }
  else if (productQuantity.value >= 1 && cartContent.classList.contains('not-empty')) {
    reusables.cartBadge()
    totalQuantityInCartIndex = Number(totalQuantityInCartIndex) + Number(productQuantity.value);
    const totalAmount = document.querySelector('.product-price span').innerHTML * totalQuantityInCartIndex;
    document.querySelector('.calculate-price').innerHTML = `${document.querySelector('.product-price').innerHTML} x ${totalQuantityInCartIndex}`
    document.querySelector('.total-price').innerHTML = `$${totalAmount.toPrecision(String(totalAmount).length + 2)}`;
  }
  productQuantityIndex = 0;
  productQuantity.value = 0;
})
