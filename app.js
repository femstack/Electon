const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
require("dotenv").config();
const generalroutes = require("./routes/general");
const authroutes = require("./routes/authgen");
const cartroutes = require("./routes/cart");
const profileroutes = require("./routes/profile");
const paymentroutes = require("./routes/payment");
const wishlistroutes = require("./routes/wishlist");
const cookiep = require("cookie-parser");
// const cors = require("cors");

//Set up Engine
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      adminaccess: function (user) {
        if (!user) {
          return false;
        } else {
          if (user.role === "admin") {
            return true;
          } else {
            return false;
          }
        }
      },
      firstName: function (name) {
        if (!name) return "Guest";
        return name.split(" ")[0];
      },

      cartlength: (cart) => {
        if (!cart) {
          return 0;
        } else {
          return cart.length;
        }
      },

      totalsum: (quantity, price) => {
        const sum = quantity * price;
        return sum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },

      formatprice: (price) => {
        return price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },

      sumtotal: (cart) => {
        let sum = 0;
        for (let item of cart) {
          sum += item.products.price * item.quantity;
        }
        return sum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },

      checkempty: (cart) => {
        if (!cart) {
          return true;
        }
        if (cart.length === 0) {
          return true;
        } else {
          return false;
        }
      },

      formatDate(date) {
        const options = { year: "numeric", month: "long", day: "2-digit" };
        return new Date(date).toLocaleDateString("en-US", options);
      },

      disableFieldOnUpdate(user, fieldName) {
        if (user && user[fieldName]) {
          return "disabled";
        } else {
          return "";
        }
      },
    },
  })
);

//Start the engine
app.set("view engine", "hbs");

//MiddleWare
app.use(fileUpload());
app.use(cookiep());
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", generalroutes);
app.use("/", authroutes);
app.use("/", cartroutes);
app.use("/", profileroutes);
app.use("/", paymentroutes);
app.use("/", wishlistroutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ DB connected successfully");
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB", err);
  });

// const mongoURI = process.env.MONGO_URI;

// if (!mongoURI) {
//     console.error("❌ MongoDB URI is missing. Check your .env file.");
//     process.exit(1);  // Stop the server if no URI is found
// }

// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("✅ Connected to MongoDB"))
// .catch(err => console.error("❌ MongoDB connection error:", err));

app.all("*", (req, res) => {
  try {
    res.render("404");
  } catch (err) {
    console.error(err);
  }
});

const port = process.env.PORT || 5502;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
