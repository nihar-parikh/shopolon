import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorhandler.js";

//create product -- Admin
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  //our user is in req.user, so passing user's id in product's req.body
  req.body.user = req.user._id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//get all products
export const getAllProducts = catchAsyncErrors(async (req, res) => {
  const { name, description, category, priceGte, priceLte, ratings } =
    req.query;
  // console.log(priceGte, priceLte);

  let searchQuery = {};

  if (name) {
    searchQuery.name = {
      $regex: name,
      $options: "i",
    };
  }

  if (description) {
    searchQuery.description = {
      $regex: description,
      $options: "i",
    };
  }
  if (category) {
    searchQuery.category = {
      $regex: category,
      $options: "i",
    };
  }
  if (priceGte) {
    searchQuery.price = {
      // $regex: price,
      // $options: "i",
      $gte: priceGte,
    };
  }
  if (priceLte) {
    searchQuery.price = {
      // $regex: price,
      // $options: "i",
      $lte: priceLte,
    };
  }
  if (priceGte && priceLte) {
    searchQuery.price = {
      // $regex: price,
      // $options: "i",
      $gte: priceGte,
      $lte: priceLte,
    };
  }

  if (ratings) {
    searchQuery.ratings = {
      // $regex: price,
      // $options: "i",
      $gte: ratings,
    };
  }

  const products = await Product.find(searchQuery);
  // console.log(products);
  res.status(200).json({
    success: true,
    products,
  });
});

//get a single product
export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.productId);
  if (!product) {
    // return res.status(500).json({
    //   success: false,
    //   message: "Product not found",
    // });
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//update product -- admin
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.productId);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true,
    newValidator: true,
    useFindAndModify: true,
  });
  res.status(201).json({
    success: true,
    product,
  });
});

//delete product -- admin
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.productId);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.remove();
  res.status(201).json({
    success: true,
    product,
  });
});
