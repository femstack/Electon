const mongoose = require("mongoose");
const productmodel = require("../models/products");
const Useraccountmodel = require("../models/useraccount");
const cartmodel = require("../models/cart");
const { generateProductCode } = require("../middlewares/unique");

const getcartpage = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");

    const products = await productmodel.find();
    res.render("cart-page", {
      user,
      cart,
      products,
      message: req.query?.message,
      error: req.query?.error,
    });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
      products: [],
    });
  }
};

// const addcart = async (req, res) => {
//   try {
//     const sku = req.params.sku;
//     if (!sku) {
//       return res.redirect("/collection?error=Invalid Product");
//     }
//     const product = await productmodel.findOne({ sku });
//     if (!product) {
//       return res.redirect("/collection?error=Product Not found");
//     }
//     const user = req.user;
//     const productCode = await generateProductCode();
//     await cartmodel.create({
//       productCode: productCode,
//       account: user._id,
//       products: product._id,
//       checkedout: false, // 👈 Ensure this is explicitly set
//     });
//     res.redirect(`/collection?message=${product.title} added to cart`);
//   } catch (err) {
//     console.log(`Error occured: ${err.message}`);
//     res.render("500", {
//       message: "Error Occured while adding product to cart",
//     });
//   }
// };

// Update Cart Quantity & Total Price

const addcart = async (req, res) => {
  try {
    const sku = req.params.sku;
    if (!sku) {
      return res.redirect("/collection?error=Invalid Product");
    }

    const product = await productmodel.findOne({ sku });
    if (!product) {
      return res.redirect("/collection?error=Product Not found");
    }

    const user = req.user;

    // Check if the product already exists in the cart
    const existingCartItem = await cartmodel.findOne({
      account: user._id,
      products: product._id,
      checkedout: false,
    });

    if (existingCartItem) {
      // Just increment quantity
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      const productCode = await generateProductCode();
      await cartmodel.create({
        productCode: productCode,
        account: user._id,
        products: product._id,
        quantity: 1,
        checkedout: false,
      });
    }

    res.redirect(`/collection?message=${product.title} added to cart`);
  } catch (err) {
    console.log(`Error occurred: ${err.message}`);
    res.render("500", {
      message: "Error Occurred while adding product to cart",
    });
  }
};

// const updateCartQuantity = async (req, res) => {
//   try {
//     const cartId = req.params.id;
//     const { quantity } = req.body;

//     if (!quantity || quantity < 1) {
//       return res.redirect("/cart-page?message=Invalid quantity");
//     }

//     const cartItem = await cartmodel.findById(cartId).populate("products");
//     if (!cartItem) {
//       return res.redirect("/cart-page?message=Cart item not found");
//     }

//     const newTotal = cartItem.products.price * quantity;

//     cartItem.quantity = quantity;
//     cartItem.totalPrice = newTotal;
//     await cartItem.save();

//     res.redirect("/cart-page?message=Quantity updated");
//   } catch (err) {
//     console.log(`Error occurred: ${err.message}`);
//     const cart = await cartmodel
//       .find({ account: req.user._id }) // Make sure `req.user` is available
//       .populate("products");

//     res.render("500", {
//       message: "Error occurred while updating quantity",
//       cart,
//     });
//   }
// };

const addToCartFromTemplate = async (req, res) => {
  try {
    const productId = req.params.id;
    const quantity = parseInt(req.query.qty) || 1;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.redirect("/collection?error=Invalid Product ID");
    }

    const product = await productmodel.findById(productId);
    if (!product) {
      return res.redirect("/collection?error=Product not found");
    }

    const user = req.user;

    const existingCartItem = await cartmodel.findOne({
      account: user._id,
      products: product._id,
      checkedout: false,
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      existingCartItem.totalPrice = existingCartItem.quantity * product.price;
      await existingCartItem.save();
    } else {
      const productCode = await generateProductCode();
      await cartmodel.create({
        productCode: productCode,
        account: user._id,
        products: product._id,
        quantity: quantity,
        totalPrice: quantity * product.price,
        checkedout: false,
      });
    }

    return res.redirect(
      `/product-template/${productId}?message=${product.title} added to cart`
    );
  } catch (err) {
    console.log(`Error occurred: ${err.message}`);
    return res.render("500", {
      message: "Error Occurred while adding product to cart",
    });
  }
};

const removecart = async (req, res) => {
  try {
    const cartid = req.params.id;
    await cartmodel.findByIdAndDelete(cartid);
    res.redirect("/cart-page?message=Product removed from cart");
  } catch (err) {
    console.log(`Error occured: ${err.message}`);
    const cart = await cartmodel
      .find({ account: user._id })
      .populate("product");
    res.render("500", {
      message: "Error Occured while deleting product from cart",
      cart,
    });
  }
};

const clearedcart = async (req, res) => {
  const user = req.user;

  try {
    // Delete all cart items for the user
    await cartmodel.deleteMany({ account: user._id });

    // Check if the cart is now empty
    const remainingCart = await cartmodel.find({ account: user._id });

    if (remainingCart.length === 0) {
      // Render the empty cart page with a success message
      return res.render("cart-empty", {
        user,
        message: "All products have been removed from your cart.",
      });
    }

    // Fallback (shouldn’t happen if deleteMany works properly)
    res.redirect("/cart?message=Products cleared from cart");
  } catch (err) {
    console.log(`Error occurred: ${err.message}`);

    const cart = await cartmodel
      .find({ account: user._id })
      .populate("product");

    res.render("500", {
      message: "Error occurred while clearing products from cart",
      cart,
      user,
    });
  }
};

module.exports = {
  addcart,
  getcartpage,
  removecart,
  clearedcart,
  addToCartFromTemplate,
};
