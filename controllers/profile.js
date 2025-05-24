const useraccount = require("../models/useraccount");
const { validateUpdate, validateAddress } = require("../middlewares/validate");
const addressmodal = require("../models/address");

const getprofile = async (req, res) => {
  try {
    const user = req.user;
    const payments = await Transaction.find({ "cart.account": user._id })
      .populate("cart._id")
      .populate("cart.product")
      .populate("address");
    res.render("profile", {
      user,
      message: req.query?.message,
      error: req.query?.error,
      payments,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateprofile = async (req, res) => {
  try {
    const user = req.user;
    // console.log(req.body);
    const account = await useraccount.findOne({ _id: user.id });
    if (!account) {
      return res.redirect(`/profile?error = User not found, please login`);
    }
    const {
      firstname,
      lastname,
      country,
      city,
      address,
      zipcode,
      username,
      email,
      phone,
      state,
    } = req.body;
    // account.firstname = firstname;
    // account.lastname = lastname;
    account.country = country;
    account.city = city;
    account.address = address;
    account.zipcode = zipcode;
    if (!user?.username) {
      account.username = username;
    }
    if (firstname) account.firstname = firstname;
    if (lastname) account.lastname = lastname;
    account.email = email;
    account.phone = phone;
    account.state = state;
    if (req.body?.photo) {
      account.image = req.body.photo;
    }
    await account.save();

    res.redirect("/profile?message=User information updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).redirect("/profile?error=Something went wrong");
  }
};

const addAddress = async (req, res) => {
  try {
    const user = req.user;

    const { error } = validateAddress.validate(req.body);
    if (error) {
      console.log(error);
      return res.redirect(`/checkout?error=${error.details[0].message}`);
    }

    const {
      firstname,
      lastname,
      companyname,
      streetaddress,
      email,
      phone,
      city,
      state,
      country,
      zipcode,
      apartment,
    } = req.body;

    await addressmodal.create({
      addedby: user._id,
      firstname,
      lastname,
      companyname,
      streetaddress,
      email,
      phone,
      city,
      state,
      country,
      zipcode,
      apartment,
    });
    res.redirect("/checkout?message=Address added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).redirect("/checkout?error=Something went wrong");
  }
};

// const updateAddress = async (req, res) => {
//   try {
//     const user = req.user; // assume user is attached via auth middleware
//     const account = await useraddress.findOne({ _id: user.id });

//     if (!account) {
//       return res.redirect(`/profile?error=User not found, please login`);
//     }

//     const { company, country, city, address, } = req.body;

//     // Update billing fields
//     account.company = company;
//     account.country = country;
//     account.city = city;
//     account.address = address;

//     await account.save();

//     res.redirect("/pro-address?message=Billing address updated successfully");
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .redirect("/profile?error=Something went wrong while updating address");
//   }
// };

module.exports = { getprofile, updateprofile, addAddress };
