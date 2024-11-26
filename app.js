// Scroll through product images
const productImageHolder = document.querySelector('.product-image-holder');
const productImage = document.querySelectorAll('.product');
const previousImage = document.querySelector('.previous-image');
const nextImage = document.querySelector('.next-image');

const productImageArray = Array.from(productImage)
let currentIndex = 0;

const productImageGen = (elem, method1, class1, method2, class2, method3) => {
  elem.addEventListener('click', () => {
    if (method1()) {
      productImageArray[currentIndex].classList.add(class1)
      productImageArray[method2()].classList.remove(class2)
      method3()
    }
  })
}

productImageGen(nextImage, () => currentIndex < productImageArray.length - 1, 'left-full', () => currentIndex + 1, 'right-full', () => currentIndex++)

productImageGen(previousImage, () => currentIndex > 0, 'right-full', () => currentIndex - 1, 'left-full', () => currentIndex--)


// Add to cart
const increaseProductNumber = document.querySelector('.increase-product-number');
const reduceProductNumber = document.querySelector('.reduce-product-number');
const numberOfProduct = document.querySelector('.number-of-product');
const addToCart = document.querySelector('.add-to-cart');
let productIndex = 0;

const countProduct = (elem, method1, method2) => {
  elem.addEventListener('click', () => {
    if (method1()) {
      method2();
      numberOfProduct.value = productIndex;
    }
  })
}

countProduct(increaseProductNumber, () => productIndex >= 0, () => productIndex++)
countProduct(reduceProductNumber, () => productIndex >= 1, () => productIndex--)