const {initializePayment,verifypayment } = require("../controllers/payment");
const express = require("express");
const router = express.Router();
const { verifyToken, unverifyToken } = require("../middlewares/verify");


router.get("/initialize/:addressid", verifyToken, initializePayment);
router.get("/verify", verifyToken, verifypayment);


module.exports = router;