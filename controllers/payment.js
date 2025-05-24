const url = "https://api.paystack.co/transaction/initialize";
const axios = require("axios");
const cartmodel = require("../models/cart");
const paymentmodel = require("../models/payment");
const { generateOrderNum } = require("../middlewares/unique");
// const jwt = require("jsonwebtoken");

const initializePayment = async (req, res) => {
  const user = req.user;
  try {
    const { addressid } = req.params;
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    if (!cart || cart.length === 0) {
      return res.redirect("/checkout?error=Cart is empty");
    }
    let amount = 0;
    cart.forEach((item) => {
      amount += item.products.price * item.quantity;
    });

    const response = await axios.post(
      url,
      {
        amount: amount * 100,
        email: user.email,
        callback_url: "http://localhost:5502/verify",
        metadata: {
          addressid,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200) {
      const cartitems = await cart.map((item) => {
        return {
          product: item.products._id,
          quantity: item.quantity,
          price: item.products.price,
          account: user._id,
        };
      });
      const data = response.data;
      const OrderNum = await generateOrderNum();
      await paymentmodel.create({
        account: user._id,
        reference: data.data.reference,
        amount: amount,
        orderNum: OrderNum,
        access_code: data.data.access_code,
        address: addressid,
        cart: cartitems,
      });

      // console.log({
      //   account: user._id,
      //   reference: data.data.reference,
      //   amount: amount,
      //   access_code: data.data.access_code,
      //   address: addressid,
      //   cart: cartitems,
      // });

      return res.redirect(`${data.data.authorization_url}`);
    } else {
      console.log(response.data);
      return res.redirect("/checkout?error=Payment initialized Failed");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/checkout?error=Payment initialized Failed");
  }
};

const verifypayment = async (req, res) => {
  const user = req.user;
  try {
    const token = req.cookies?.electon_cookie;
    // console.log(token);
    if (!token) return res.redirect("/login-account");

    const { trxref, reference } = req.query;
    if (!trxref && !reference) {
      return res.redirect("/checkout?error= payment verification failed");
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.status == 200) {
      const data = response.data.data;
      // console.log("Successful");

      const ref = data.reference;
      const payment = await paymentmodel.findOne({ reference: ref });
      if (!payment) {
        return res.redirect("/checkout?error= payment not found");
      }
      payment.paid_at = data.paid_at;
      payment.status = data.status;
      payment.channel = data.channel;
      payment.fees = data.fees / 100;
      await payment.save();

      await cartmodel.updateMany(
        { account: user._id, checkedout: false },
        { $set: { checkedout: true } }
      );
      return res.redirect("/checkout?message= payment verification  successful");
    } else {
      console.log("Error");
      console.log(response.data);
      return res.redirect("/checkout?error= payment verification failed");
    }
  } catch (error) {
    return res.redirect("/checkout?error=Payment initialized Failed");
  }
};

module.exports = { initializePayment, verifypayment };
