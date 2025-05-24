const {getprowishlist, addWishlist, clearedwishlist} = require("../controllers/wishlist")
const express = require("express")
const router = express.Router()
const { verifyToken, unverifyToken } = require("../middlewares/verify");

router.get("/pro-wishlist", verifyToken, getprowishlist);
router.get("/wishlist/:id", verifyToken, addWishlist);
router.get("/cart-wishlist", verifyToken, clearedwishlist);

module.exports = router;