const {
  gethome,
  getabout,
  getcontact,
  getshipping,
  getsitemap,
  getterms,
  gettrack,
  getwislistemp,
  getwislistprod,
  getbilling,
  getblog,
  getcoming,
  getcancellation,
  getfaq,
  getcartempty,
  getcheckout,
  getchangepass,
  getpage,
  getpaymentpolicy,
  getprivacypolicy,
  getproducttemplate,
  getsearch,
  getArticlepost,
  getreturn,
  getproadd,
  getprotick,
  getcollection,
  getorderhistory,
  getordercomplete,
  getprofile,
  postForm,
  getaddproduct,
  postProduct,
  getblogform,
  postBlog,
  postComment,
} = require("../controllers/general");
const express = require("express");
const router = express.Router();
const { verifyToken, unverifyToken } = require("../middlewares/verify");

router.get("/", unverifyToken, gethome);
router.get("/about-us", verifyToken, getabout);
//  router.get ("/account", getaccount);
router.get("/billing-info", unverifyToken, getbilling);
router.get("/blog-grid", unverifyToken, getblog);
router.get("/cancellation", verifyToken, getcancellation);
router.get("/cart-empty", getcartempty);
router.get("/change-password", verifyToken, getchangepass);
router.get("/checkout", verifyToken, getcheckout);
router.get("/collection", unverifyToken, getcollection);
router.get("/coming-soon", unverifyToken, getcoming);
router
  .route("/contact-us")
  .get(unverifyToken, getcontact)
  .post(unverifyToken, postForm);
router.get("/faq", getfaq);
router.get("/order-complete", verifyToken, getordercomplete);
router.get("/order-history", verifyToken, getorderhistory);
//  router.get ("/page", getpage);
router.get("/payment-policy", verifyToken, getpaymentpolicy);
router.get("/privacy-policy", unverifyToken, getprivacypolicy);
router.get("/pro-address", verifyToken, getproadd);
router.get("/pro-tickets", unverifyToken, getprotick);
router.get("/product-template/:id", unverifyToken, getproducttemplate);
router.get("/profile/", verifyToken, getprofile);
router.get("/return-policy", verifyToken, getreturn);
router.get("/article-post/:id", unverifyToken, getArticlepost);
router.get("/search", unverifyToken, getsearch);
router.get("/shipping-policy", verifyToken, getshipping);
router.get("/sitemap", verifyToken, getsitemap);
router.get("/terms-condition", unverifyToken, getterms);
router.get("/track-page", verifyToken, gettrack);
router.get("/wishlist-empty", verifyToken, getwislistemp);
router.get("/wishlist-product", verifyToken, getwislistprod);
router.get("/addproduct", verifyToken, getaddproduct);
router.post("/addproduct", verifyToken, postProduct);
router.get("/blogform", verifyToken, getblogform);
router.post("/blogform", verifyToken, postBlog);
router.post("/article-post/:id/comment", unverifyToken, postComment);


module.exports = router;
