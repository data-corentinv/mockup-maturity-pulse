import pillarsData from './pillars.json';
import questionsData from './questions.json';
import productsData from './products.json';

// Load initial data
let products = productsData.products;

// Function to update products
export const updateProducts = (newProducts: typeof products) => {
  products = newProducts;
};

export const pillars = pillarsData.pillars;
export const questions = questionsData.questions;
export { products };