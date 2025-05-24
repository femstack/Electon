const mongoose = require("mongoose");
const productmodel = require("../models/products");
const wishlistmodel = require("../models/wishlish");
const cartmodel = require("../models/cart");

const getprowishlist = async (req, res) => {
  const user = req.user;

  try {
    // Fetch wishlist items for the logged-in user
    const wishlist = await wishlistmodel
      .find({ account: user._id })
      .populate("products");
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    res.render("pro-wishlist", {
      user,
      wishlist,
      message: req.query?.message,
      error: req.query?.error,
      cart,
    });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    console.error(`Error fetching wishlist: ${err.message}`);
    res.status(500).render("500", {
      message: "Error occurred while loading wishlist",
      cart,
    });
  }
};

const addWishlist = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.redirect("/collection?error=Invalid Product ID");
    }

    const user = req.user;

    // Check if the product exists in the product collection
    const product = await productmodel.findById(productId);

    if (!product) {
      return res.redirect("/collection?error=Product Not Found");
    }
    // console.log(product)

    // Check if product is already in wishlist
    const productAdded = await wishlistmodel.findOne({
      account: user._id,
      products: product._id,
    });

    if (productAdded) {
      return res.redirect("/collection?message=Already in Wishlist");
    }

    // Add to wishlist
    await wishlistmodel.create({
      account: user._id,
      products: product._id,
    });

    res.redirect(`/collection?message=${product.title} added to Wishlist`);
  } catch (err) {
    console.log(`Error occurred: ${err.message}`);
    res.render("500", {
      message: "Error occurred while adding product to wishlist",
    });
  }
};

const clearedwishlist = async (req, res) => {
  const user = req.user;

  try {
    // Delete all cart items for the user
    await wishlistmodel.deleteMany({ account: user._id });

    // Check if the cart is now empty
    const remainingCart = await wishlistmodel.find({ account: user._id });

    if (remainingCart.length === 0) {
      // Render the empty cart page with a success message
      return res.render("wishlist-empty", {
        user,
        message: "All products have been removed from your Wishlist.",
      });
    }

    // Fallback (shouldn’t happen if deleteMany works properly)
    res.redirect("/wishlist-product?message=Products cleared from cart");
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

module.exports = { getprowishlist, addWishlist, clearedwishlist };
