const { registerSchema, loginSchema, validatepassword } = require("../middlewares/validate");
const account = require("../models/useraccount");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getlogin = async (req, res) => {
  try {
    res.render("login-account", {
      message: req.query?.message,
      error: req.query?.error,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const getcreateaccount = async (req, res) => {
  try {
    res.render("create-account", {
      message: req.query?.message,
      error: req.query?.error,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.redirect(`/create-account?error=${error.details[0].message}`);
    }

    const { firstname, lastname, email, phone, password } = req.body;

    let mail = await account.findOne({ email });
    if (mail) {
      return res.redirect("/create-account?error=Email already exists");
    }

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!strongPasswordPattern.test(password)) {
      return res.redirect("/create-account?error=New password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 symbol, and be at least 8 characters long");
    }

    await account.create({
      firstname,
      lastname,
      phone,
      email,
      password,
    });

    res.redirect(
      "/login-account?message=Account created successfully, please login"
    );
  } catch (error) {
    console.log(error);
    return res.redirect("/create-account?error=Something went wrong");
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.redirect(`/login-account?error=${error.details[0].message}`);
    }

    const { email, password } = req.body;
    const checkmail = await account.findOne({ email });
    if (!checkmail) {
      return res.redirect("/login-account?error=Invalid Credentials");
    }


    const compare = await bcrypt.compare(password, checkmail.password);
    if (!compare) {
      return res.redirect("/login-account?error=Invalid Credentials");
    }

    const token = await jwt.sign(
      { id: checkmail._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // console.log("generated token.", token)
    res.cookie("electon_cookie", token, {
      maxAge: 60 * 60 * 1000, // Correct: 1 hour in milliseconds
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "Lax",
    });
    res.redirect("/?message=Account logged in successfully");
  } catch (error) {
    console.log(error);
    return res.redirect("/create-account?error=Something went wrong");
  }
};

const updatepassword = async (req, res) => {
  try {
    const user = req.user;

    const { error } = validatepassword.validate(req.body);
    if (error) {
      console.log(error);
      return res.redirect(`/change-password?error=${error.details[0].message}`);
    }

    const { password, newpassword } = req.body;

    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!strongPasswordPattern.test(newpassword)) {
      return res.redirect(
        "/change-password?error=New password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 symbol, and be at least 8 characters long"
      );
    }

    const accountp = await account.findOne({ _id: user._id });
    // console.log(accountp)
    if (!accountp) {
      return res.redirect("/login-account?error= User not Found, Pls Login");
    }

    const isMatch = await bcrypt.compare(password, accountp.password);
    if (!isMatch) {
      return res.redirect("/change-password?error=Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    accountp.password = hashedPassword;
    await accountp.save();
    res.redirect("/change-password?message = Password Updated Successfully");
  } catch (err) {
    console.log(err);
    res.render("500", { user });
  }
};

// logout.js
const logout = async (req, res) => {
  try {
    res.clearCookie("electon_cookie");
    res.redirect("/?message =Logout Successfully");
  } catch (err) {
    console.log(err);
    res.redirect("/?error =Logout Failed");
  }
};

module.exports = {
  getlogin,
  getcreateaccount,
  register,
  login,
  updatepassword,
  logout,
};
