const {getlogin, getcreateaccount, register, login, logout, updatepassword } = require("../controllers/authgen")
const express = require("express")
const router = express.Router()
const { verifyToken, unverifyToken } = require("../middlewares/verify");



router.get("/login-account", getlogin)
router.get("/logout", verifyToken, logout)
router.post("/login-account", login)
router.post("/update-password", verifyToken, updatepassword)
router.get("/create-account", getcreateaccount)
router.post("/create-account", register)

module.exports = router;