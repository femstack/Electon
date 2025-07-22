const Joi = require("joi");

const validateProduct = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  subtitle: Joi.string().required().messages({
    "string.empty": "SubTitle is required",
  }),
  price: Joi.number().min(1).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be less than 1",
    "any.required": "Price is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),
  content: Joi.string().required().messages({
    "string.empty": "Content is required",
  }),
  discount: Joi.number().min(0).max(Joi.ref("price")).default(0).messages({
    "number.base": "Discount must be a number",
    "number.min": "Discount cannot be less than 0",
    "number.max": "Discount cannot be more than price",
    "any.required": "Discount is required",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be less than 0",
    "any.required": "Stock is required",
  }),
  availability: Joi.boolean().required().messages({
    "any.required": "Availability status is required",
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
  aboutProduct: Joi.any().required().messages({
    "any.required": "About product are required",
  }),
});

const registerSchema = Joi.object({
  firstname: Joi.string().required().messages({
    "string.empty": "firstname is required",
  }),
  lastname: Joi.string().required().messages({
    "string.empty": "lastname is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
  }),
  phone: Joi.string().pattern(/^\d+$/).required().messages({
    "string.empty": "Phone is required",
    "string.pattern.base": "Phone must be 11 digits",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
  }),
});

const validateUpdate = Joi.object({
  firstname: Joi.string().required().messages({
    "string.empty": "First name is required.",
  }),
  lastname: Joi.string().required().messages({
    "string.empty": "Last name is required.",
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required.",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City is required.",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required.",
  }),
  zipcode: Joi.string().required().messages({
    "string.empty": "ZIP code is required.",
  }),
  username: Joi.string().required().messages({
    "string.empty": "Username is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required.",
  }),
  state: Joi.string().required().messages({
    "string.empty": "State is required.",
  }),
});

const validateAddress = Joi.object({
  firstname: Joi.string().required().messages({
    "string.empty": "First name is required.",
  }),
  lastname: Joi.string().required().messages({
    "string.empty": "Last name is required.",
  }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required.",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City is required.",
  }),
  streetaddress: Joi.string().required().messages({
    "string.empty": "Street Address is required.",
  }),
  apartment: Joi.string().required().messages({
    "string.empty": "Apartment Number is required.",
  }),
  zipcode: Joi.string().required().messages({
    "string.empty": "ZIP code is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    // "string.email": "Email must be a valid email address.",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required.",
  }),
  state: Joi.string().required().messages({
    "string.empty": "State is required.",
  }),
  companyname: Joi.string().optional().messages({
    "string.empty": "Company name is Optional.",
  }),
});

const validatepassword = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
  newpassword: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const validateBlog = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  date: Joi.date().required(),
  excerpt: Joi.string().required().messages({
    "string.empty": "SubTitle is required",
  }),
  content: Joi.string().required().messages({
    "string.empty": "Content is required",
  }),
  tags: Joi.alternatives()
    .try(
      Joi.string(), // single tag
      Joi.array().items(Joi.string()) // multiple tags
    )
    .required()
    .messages({
      "any.required": "Tags are required",
      "string.base": "Each tag must be a string",
      "array.includes": "Tags must be strings",
    }),
});

module.exports = {
  validateProduct,
  registerSchema,
  loginSchema,
  validateUpdate,
  validateAddress,
  validatepassword,
  validateBlog,
};
