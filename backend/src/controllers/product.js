import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import ApiFeatures from "../utils/apiFeatures.js";
import ErrorHandler from "../utils/errorhandler.js";

//create product -- Admin
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  //our user is in req.user, so passing user's id in product's req.body
  req.body.createdBy = {
    userId: req.user._id,
    userName: req.user.name,
    role: req.user.role,
  };

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//get all products
// export const getAllProducts = catchAsyncErrors(async (req, res) => {
//   const { name, description, category, priceGte, priceLte, ratings } =
//     req.query;
//   // console.log(priceGte, priceLte);

//   let searchQuery = {};

//   if (name) {
//     searchQuery.name = {
//       $regex: name,
//       $options: "i",
//     };
//   }

//   if (description) {
//     searchQuery.description = {
//       $regex: description,
//       $options: "i",
//     };
//   }
//   if (category) {
//     searchQuery.category = {
//       $regex: category,
//       $options: "i",
//     };
//   }
//   if (priceGte) {
//     searchQuery.price = {
//       // $regex: price,
//       // $options: "i",
//       $gte: priceGte,
//     };
//   }
//   if (priceLte) {
//     searchQuery.price = {
//       // $regex: price,
//       // $options: "i",
//       $lte: priceLte,
//     };
//   }
//   if (priceGte && priceLte) {
//     searchQuery.price = {
//       // $regex: price,
//       // $options: "i",
//       $gte: priceGte,
//       $lte: priceLte,
//     };
//   }

//   if (ratings) {
//     searchQuery.ratings = {
//       // $regex: price,
//       // $options: "i",
//       $gte: ratings,
//     };
//   }

//   const products = await Product.find(searchQuery);
//   // console.log(products);
//   res.status(200).json({
//     success: true,
//     products,
//   });
// });

//get all products
export const getAllProducts = catchAsyncErrors(async (req, res) => {
  const productsPerPage = 2;

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .pagination(productsPerPage);
  const products = await apiFeatures.query;
  const productsCount = await Product.countDocuments();

  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});

//get a single product
export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.productId);
  // .populate(
  //   "createdBy.userId",
  //   "name email"
  // );
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
    // return res.status(500).json({
    //   success: false,
    //   message: "Product not found",
    // });
    return next(new ErrorHandler("Product not found", 404));
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
    // return res.status(500).json({
    //   success: false,
    //   message: "Product not found",
    // });
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.remove();
  res.status(201).json({
    success: true,
    product,
  });
});

// create new product review or update the review
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { ratings, comment } = req.body;
  const review = {
    userId: req.user._id,
    userName: req.user.name,
    ratings: Number(ratings),
    comment,
  };

  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(
      new ErrorHandler(
        `Product with id : ${req.params.productId} doesn't exist`,
        400
      )
    );
  }

  let isReviewedPreviously = false;
  product.reviews.map((review) => {
    if (review.userId.toString() === req.user._id.toString()) {
      isReviewedPreviously = true;
    }
  });

  if (isReviewedPreviously) {
    product.reviews.map((review) => {
      if (review.userId.toString() === req.user._id.toString()) {
        review.ratings = Number(ratings);
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // let avg = 0;

  // product.reviews.forEach((rev) => {
  //   avg += rev.ratings;
  // });

  // product.totalAverageRatings = findAverage(product.reviews);
  // const findAverage = (reviews) => {
  //   return reviews.reduce((a.ratings, b.ratings) => a.ratings + b.ratings) / reviews.length;
  // };
  product.totalAverageRatings =
    product.reviews.reduce((n, { ratings }) => n + ratings, 0) /
    product.reviews.length;

  //use aggregate later......
  //   product.aggregate([
  //     { $project: { avgRatings: { $avg: "$quizzes"} } }
  //  ])

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//get product reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new ErrorHandler(
        `Product not found with id : ${req.params.productId}`,
        400
      )
    );
  }

  res.status(200).json({
    success: true,
    ratings: product.totalAverageRatings,
    numOfReviews: product.numOfReviews,
    reviews: product.reviews,
  });
});

//delete product reviews
export const deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(
      new ErrorHandler(
        `Product not found with id : ${req.query.productId}`,
        400
      )
    );
  }
  let filteredReviews = [];
  // product.reviews.map((review) => {
  //   if (
  //     review._id.toString() !== req.params.reviewId.toString() &&
  //     review.userId.toString() !== req.user._id.toString()
  //   ) {
  //     return next(
  //       new ErrorHandler(`You are not allowed to delete this review`, 404)
  //     );
  //   } else {
  filteredReviews = product.reviews.filter((review) => {
    return (
      review._id.toString() !== req.params.reviewId.toString() &&
      review.userId.toString() !== req.user._id.toString()
    );
  });
  //   }
  // });

  product.reviews = filteredReviews;
  product.numOfReviews = filteredReviews.length;
  product.totalAverageRatings =
    product.reviews.reduce((n, { ratings }) => n + ratings, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });

  //or this way
  // await Product.findByIdAndUpdate(
  //   req.query.productId,
  //   {
  //     reviews: filteredReviews,
  //     totalAverageRatings: product.totalAverageRatings,
  //     numOfReviews: filteredReviews.length,
  //   },
  //   {
  //     new: true,
  //     runValidators: true,
  //     useFindAndModify: false,
  //   }
  // );

  res.status(200).json({
    success: true,
    ratings: product.totalAverageRatings,
    numOfReviews: product.numOfReviews,
    reviews: product.reviews,
  });
});
