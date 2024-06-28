import { formatCurrency } from '../scripts/utils/money.js';

export function getProduct(productId) {
  return products.find(product => product.id === productId);
}

class Product {
  constructor({ id, image, name, rating, priceCents }) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.rating = rating;
    this.priceCents = priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return '';
  }
}

class Clothing extends Product {
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size Chart
      </a>
    `;
  }
}

export let products = [];

export function loadProductsFetch() {
  return fetch('https://supersimplebackend.dev/products')
    .then(response => response.json())
    .then(productsData => {
      products = productsData.map(productDetails => 
        productDetails.type === 'clothing' 
          ? new Clothing(productDetails) 
          : new Product(productDetails)
      );
      console.log('Products loaded');
    })
    .catch(() => {
      console.log('Unexpected error. Please try again later.');
    });
}

export function loadProducts(callback) {
  const xhr = new XMLHttpRequest();
  
  xhr.addEventListener('load', () => {
    products = JSON.parse(xhr.response).map(productDetails => 
      productDetails.type === 'clothing' 
        ? new Clothing(productDetails) 
        : new Product(productDetails)
    );
    console.log('Products loaded');
    callback();
  });

  xhr.addEventListener('error', () => {
    console.log('Unexpected error. Please try again later.');
  });

  xhr.open('GET', 'https://supersimplebackend.dev/products');
  xhr.send();
}
