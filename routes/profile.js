const {getprofile, updateprofile, addAddress} = require("../controllers/profile")
const express = require("express")
const router = express.Router()
const { verifyToken, unverifyToken } = require("../middlewares/verify");
const { uploadpic } = require("../middlewares/upload");

router.get("/profile", verifyToken, getprofile);
router.get("/Address", verifyToken, addAddress);
router.post("/Address", verifyToken, addAddress);
// router.post("/update-address", verifyToken, updateAddress);
router.post("/update-profile", verifyToken, uploadpic, updateprofile);

module.exports = router;
