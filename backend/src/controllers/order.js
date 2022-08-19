import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

//create new order
export const createNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//get single order
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  //populate() -> corresponding to first parameter "user" it refers to user table and populates name and email fields w.r.t userId
  const order = await Order.findById(req.params.orderId).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found", 400));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//get all orders of user
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  //populate() -> corresponding to first parameter "user" it refers to user table and populates name and email fields w.r.t userId
  const orders = await Order.find({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  res.status(200).json({
    success: true,
    orders,
  });
});

//get all orders of all users
export const allOrders = catchAsyncErrors(async (req, res, next) => {
  //populate() -> corresponding to first parameter "user" it refers to user table and populates name and email fields w.r.t userId
  const orders = await Order.find().populate("user", "name email");

  const totalAmount = orders.reduce((n, { totalPrice }) => n + totalPrice, 0);
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//update order status -- Admin
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  if (
    order.orderStatus === "Delivered" &&
    req.body.orderStatus === "Delivered"
  ) {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  if (
    order.orderStatus === "Processing" &&
    req.body.orderStatus === "Delivered"
  ) {
    order.deliveredAt = Date.now();
    order.orderStatus = req.body.orderStatus;
  }
  if (req.body.orderStatus === "Shipped") {
    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Processing"
    ) {
      order.orderStatus = req.body.orderStatus;
      order.orderItems.map((o) => {
        updateStock(o.product, o.quantity);
      });
    }
  }
  // order.orderStatus = req.body.orderStatus;
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

//updateStock function
const updateStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
};

// delete Order -- Admin
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
