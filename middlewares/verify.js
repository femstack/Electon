const account = require("../models/useraccount");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  // const authorize = (req, res, next) => {
  try {
    const token = req.cookies?.electon_cookie;
    // console.log("Token from cookie.", token)
    if (!token) {
      return res.redirect("/login-account?error=Unauthorized, please login");
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const useraccount = await account.findById(decoded.id).select("-password");
    req.user = useraccount;
    next();
  } catch (err) {
    console.log(err);
    const token = req.cookies?.electon_cookie;
    if (token) {
      res.clearCookie("electon_cookie");
    }
    res.redirect("/login-account?error=Unauthorized, please login");
  }
};

const unverifyToken  = async (req, res, next) => {
  try {
    const token = req.cookies?.electon_cookie;
    if (!token) {
      return next();
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const useraccount = await account.findById(decoded.id).select("-password");
    req.user = useraccount;
    next();
  } catch (err) {
    console.log(err);
    next();
  }
};

module.exports = { verifyToken, unverifyToken  };
