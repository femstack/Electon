const {addcart, getcartpage, removecart, clearedcart, addToCartFromTemplate} = require("../controllers/cart")
const express = require("express")
const router = express.Router()
const { verifyToken, unverifyToken } = require("../middlewares/verify");


router.get("/cart/:sku", verifyToken, addcart)
router.get("/cart-page", verifyToken, getcartpage);
router.get("/cart-remove/:id", verifyToken, removecart);
router.get("/cart-cleared", verifyToken, clearedcart);
router.get("/cart-add/:id", unverifyToken, addToCartFromTemplate);
// router.post('/update-cart/:id', updateCartQuantity);
// router.post("/update-cart/:id", cartController.updateCart);


module.exports = router;