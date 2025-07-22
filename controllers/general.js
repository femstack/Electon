const Contact = require("../models/contact");
const path = require("path");
const fs = require("fs");
const { validateProduct, validateBlog } = require("../middlewares/validate");
const {
  uniqueImageName,
  generateOrderId,
  uniqueBlogImageName,
} = require("../middlewares/unique");
const productmodel = require("../models/products");
const cartmodel = require("../models/cart");
const addressmodel = require("../models/address");
const Transaction = require("../models/payment");
const wishlistmodel = require("../models/wishlish");
const blogModel = require("../models/blog");

const gethome = async (req, res) => {
  const user = req.user;
  const firstName = user?.name ? user.name.split(" ")[0] : "Guest";
  try {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");

    const products = await productmodel.find();
    res.render("index", {
      cart,
      user,
      products,
      firstName,
      message: req.query?.message,
      error: req.query?.error,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("collection", {
      error: "Internal Server Error",
      message: err.message,
      user,
      cart: [],
      products: [],
    });
  }
};

const getabout = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.render("about-us", { user, cart });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getbilling = async (req, res) => {
  const user = req.user;
  try {
    res.render("billing-info", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getblog = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");

    const findBlog = await blogModel.find();

    const recentPosts = await blogModel.find().sort({ date: -1 }).limit(5);

    // const allTags = [...new Set(allPosts.flatMap(post => post.tags || []))];

    res.render("blog-grid", { user, cart, recentPosts, findBlog });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getcancellation = async (req, res) => {
  const user = req.user;
  try {
    res.render("cancellation", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getcartempty = async (req, res) => {
  const user = req.user;
  try {
    res.render("cart-empty", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getchangepass = async (req, res) => {
  const user = req.user;
  try {
    const wishlist = await wishlistmodel
      .find({ account: user._id })
      .populate("products");

    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.render("change-password", {
      user,
      message: req.query?.message,
      error: req.query?.error,
      cart,
      wishlist,
    });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getcheckout = async (req, res) => {
  const user = req.user;
  try {
    const address = await addressmodel.find({ addedby: user._id });
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    const products = await productmodel.find();
    res.render("checkout", {
      user,

      products,
      cart,
      address,
    });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res;
    res.render({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getcollection = async (req, res) => {
  const user = req.user;

  try {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");

    const products = await productmodel.find();
    res.render("collection", {
      products,
      user,
      message: req.query?.message,
      error: req.query?.error,
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("collection", {
      error: "Internal Server Error",
      message: err.message,
      user,
      cart: [],
      products: [],
    });
  }
};

const getcoming = async (req, res) => {
  const user = req.user;
  try {
    res.render("coming-soon", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getcontact = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.render("contact-us", {
      message: req.query.message, // Fixed spacing issue
      error: req.query.error,
      user,
      cart,
    });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getfaq = async (req, res) => {
  const user = req.user;
  try {
    res.render("faq", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getordercomplete = async (req, res) => {
  const user = req.user;
  try {
    res.render("order-complete", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getorderhistory = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    const payments = await Transaction.find({ "cart.account": user._id })
      .populate("cart._id")
      .populate("cart.product")
      .populate("address");

    // console.log(JSON.stringify(payments, null, 2));
    // console.log(payments);
    res.render("order-history", { user, payments, cart });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getpage = async (req, res) => {
  const user = req.user;
  try {
    res.render("page", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getpaymentpolicy = async (req, res) => {
  const user = req.user;
  try {
    res.render("payment-policy", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getprivacypolicy = async (req, res) => {
  const user = req.user;
  try {
    res.render("privacy-policy", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getproadd = async (req, res) => {
  const user = req.user;
  try {
    res.render("pro-address", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getprotick = async (req, res) => {
  const user = req.user;
  try {
    res.render("pro-tickets", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getproducttemplate = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.redirect("/collection?error=Invalid Product ID");
    }
    const products = await productmodel.findById(id);
    // console.log(products)
    if (!products) {
      return res.redirect("/collection?error=Products Not found");
    }
    res.render("product-template", { user, products, cart });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getprofile = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.render("profile", { user, cart });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user?._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getreturn = async (req, res) => {
  const user = req.user;
  try {
    res.render("return-policy", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getArticlepost = async (req, res) => {
  const user = req.user;
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).render("404", { message: "Blog post not found" });
    }
    const findBlog = await blogModel.find();

    const recentPosts = await blogModel.find().sort({ date: -1 }).limit(5);

    // const allTags = [...new Set(allPosts.flatMap(post => post.tags || []))];

    res.render("article-post", { user, blog, recentPosts, findBlog });
  } catch (err) {
    console.error("Error fetching blog:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getsearch = async (req, res) => {
  const user = req.user;
  try {
    res.render("search", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getshipping = async (req, res) => {
  const user = req.user;
  try {
    res.render("shipping-policy", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getsitemap = async (req, res) => {
  const user = req.user;
  try {
    res.render("sitemap", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getterms = async (req, res) => {
  const user = req.user;
  try {
    res.render("terms-condition", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const gettrack = async (req, res) => {
  const user = req.user;
  try {
    res.render("track-page", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getwislistemp = async (req, res) => {
  const user = req.user;
  try {
    res.render("wishlist-empty", { user });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const getwislistprod = async (req, res) => {
  const user = req.user;
  try {
    const wishlist = await wishlistmodel
      .find({ account: user._id })
      .populate("products");

    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    // console.log(wishlistItems)

    res.render("wishlist-product", { user, wishlist, cart });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getaddproduct = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    const products = await productmodel.find();
    // console.log(products)
    res.render("addproduct", {
      user,
      products,
      message: req.query?.message,
      error: req.query?.error,
      cart,
    });
    // res.sendFile(path.join(__dirname, "/addproduct"));
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const getblogform = async (req, res) => {
  const user = req.user;
  try {
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    res.render("blogform", {
      user,
      cart,
      message: req.query?.message,
      error: req.query?.error,
    });
  } catch (err) {
    const cart = await cartmodel
      .find({ account: user._id, checkedout: false })
      .populate("products");
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      user,
      cart,
    });
  }
};

const postForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.redirect(
        "/contact-us?error=Name, Email, Phone, and Message are required"
      );
    }

    await Contact.create({ name, email, phone, message });

    // ✅ Fixed spacing issue in query parameter
    res.redirect("/contact-us?message=Form submitted successfully!");
  } catch (error) {
    console.log(`Error occurred: ${error.message}`);
    res.status(500).redirect("/contact-us?error=Internal Server Error");
  }
};

const postProduct = async (req, res) => {
  const user = req.user;
  try {
    const { error } = validateProduct.validate(req.body);
    if (error) {
      console.log(error.details);
      return res.redirect(`/addproduct?=${error.details[0].message}`);
    }

    const images = req.files?.images;
    if (!images) {
      return res.redirect("/addproduct?error=Images are required");
    }
    if (!Array.isArray(images) || images.length < 4) {
      return res.redirect("/addproduct?error=Upload atleast 4 images");
    }

    // name = electon.png
    // = ["electon", "png"]
    for (let img of images) {
      const allowedExt = /jpeg|jpg|png/;
      const imgname = img.name;
      const imgExt = imgname.split(".").pop();
      const lowerExt = imgExt.toLowerCase();
      if (!allowedExt.test(lowerExt)) {
        return res.redirect(
          `/addproduct?error=Invalid extension for ${imgname}`
        );
      }
    }

    const filesize = images.reduce((acc, val) => acc + val.size, 0);
    const maxsize = 1024 * 1024 * 10;
    if (filesize > maxsize) {
      return res.redirect(`/addproduct?error=Images size can not exceed 10mb`);
    }

    const filepath = path.join(__dirname, "../public", "Goods");
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }

    let aboutProduct = req.body.aboutProduct;

    if (!Array.isArray(aboutProduct)) {
      aboutProduct = [req.body.aboutProduct];
    }

    const imgArr = await Promise.all(
      images.map(async (img) => {
        const imgname = img.name;
        const uniquename = await uniqueImageName(imgname);
        const imgdir = path.join(filepath, uniquename);
        await img.mv(imgdir, (err) => {
          if (err) {
            return res.redirect(
              `/addproduct?=Error occured while upload ${imgname}`
            );
          }
        });
        return `/Goods/${uniquename}`;
      })
    );

    const sku = await generateOrderId();
    await productmodel.create({
      postedBy: user._id,
      title: req.body.title,
      subtitle: req.body.subtitle,
      price: req.body.price,
      sku: sku,
      discount: req.body.discount,
      stock: req.body.stock,
      quantity: req.body.quantity,
      availability: req.body.availability,
      description: req.body.description,
      content: req.body.content,
      image: imgArr,

      // colors: req.body.colors,
      display: imgArr[0],
      aboutProduct: aboutProduct,
    });

    res.redirect(
      "/addproduct?message= Your Product Has Been Added Successfully"
    );
  } catch (err) {
    console.log(`Error occured: ${err}`);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message, user });
  }
};

const postBlog = async (req, res) => {
  try {
    // Convert 'tags[]' to 'tags' for Joi validation
    if (req.body["tags[]"]) {
      req.body.tags = req.body["tags[]"];
      delete req.body["tags[]"];
    }
    // console.log("📦 Submitted Body:", req.body)
    const { error } = validateBlog.validate(req.body);
    if (error) {
      console.log(error.details);
      return res.redirect(`/blogform?error=${error.details[0].message}`);
    }

    const image = req.files?.image;
    if (!image) {
      return res.redirect("/blogform?error=Image is required");
    }

    const allowedExt = /jpeg|jpg|png/;
    const imgName = image.name;
    const ext = imgName.split(".").pop().toLowerCase();
    if (!allowedExt.test(ext)) {
      return res.redirect(
        `/blogform?error=Invalid file type for ${imgName}. Only JPG, JPEG, PNG allowed.`
      );
    }

    if (image.size > 1024 * 1024 * 3) {
      return res.redirect("/blogform?error=Image size must not exceed 3MB");
    }

    const uploadDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueName = uniqueBlogImageName(imgName);
    const imagePath = path.join(uploadDir, uniqueName);

    await image.mv(imagePath, (err) => {
      if (err) {
        console.log(err);
        return res.redirect("/blogform?error=Image upload failed");
      }
    });

    let tags = req.body.tags;

    if (!Array.isArray(tags)) {
      tags = [tags]; // convert single tag to array
    }

    // Save blog to DB
    await blogModel.create({
      title: req.body.title,
      date: req.body.date,
      excerpt: req.body.excerpt,
      content: req.body.content,
      tags: tags,
      image: `/uploads/${uniqueName}`,
    });

    res.redirect("/blogform?message=Blog post published successfully!");
  } catch (err) {
    console.error("Blog post error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

const postComment = async (req, res) => {
  const blogId = req.params.id;
  const { author, email, message } = req.body;

  try {
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // Push comment
    blog.comments.push({
      author,
      email,
      message,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
    });

    await blog.save();
    res.redirect(`/article-post/${blogId}`);
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = {
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
};
