const {v4: uuidv4} = require('uuid');
const accountmodel = require("../models/useraccount");
const path = require("path");
const fs = require("fs");

const uniqueImageName = (name) =>{
    const imgExt = name.split('.').pop();
    const newName = `${uuidv4()}.${imgExt}`;
    return newName;
}

const uniqueBlogImageName = (filename) => {
  const ext = path.extname(filename);
  const name = uuidv4();
  return `${name}${ext}`;
};

const generateOrderId = async () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
    const generateRandomId = () => {
      let orderId = "";
      for (let i = 0; i < 6; i++) {
        orderId += characters[Math.floor(Math.random() * characters.length)];
      }
      return orderId;
    };
  
    let orderId;
    let exists = true;
  
    while (exists) {
      orderId = `ELE-${generateRandomId()}`;
      exists = await accountmodel.findOne({ sku: orderId });
    }
  
    return orderId;
  };

  // Function to generate a product code
const generateProductCode = async () => {   
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let productCode = '';

  // Add 3 random capital letters
  for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      productCode += letters[randomIndex];
  }

  // Add 7 random digits
  for (let i = 0; i < 7; i++) {
      const randomDigit = Math.floor(Math.random() * 10); // Generates a digit from 0 to 9
      productCode += randomDigit;
  }

  // Add 1 random capital letter at the end
  const randomIndex = Math.floor(Math.random() * letters.length);
  productCode += letters[randomIndex];

  return productCode;
}

const generateOrderNum = async () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let OrderNum = '';

  // Add 2 random digits
  for (let i = 0; i < 2; i++) {
    OrderNum += Math.floor(Math.random() * 10);
  }

  // Add 2 random capital letters
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    OrderNum += letters[randomIndex];
  }

  // Add 4 random digits
  for (let i = 0; i < 4; i++) {
    OrderNum += Math.floor(Math.random() * 10);
  }

  // Add 1 random capital letter
  OrderNum += letters[Math.floor(Math.random() * letters.length)];

  // Add 2 final digits
  for (let i = 0; i < 2; i++) {
    OrderNum += Math.floor(Math.random() * 10);
  }

  return OrderNum;
};

// Example usage
// generateOrderNum().then(console.log);


// Endpoint to generate a product code
module.exports = {uniqueImageName, generateOrderId, generateProductCode, generateOrderNum, uniqueImageName, uniqueBlogImageName};