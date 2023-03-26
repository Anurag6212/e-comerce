const Order = require("../Model/orderModel");
const asyncFn = require("../Middleware/asyncErros");
const Product = require("../Model/productModel");
const ApiFeatues = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

const newOrder = asyncFn(async (req, res, next) => {
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

const getSingleOrder = asyncFn(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found with this email id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

const getLoggedInUserOrders = asyncFn(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    order,
  });
});

const getAllOrder = asyncFn(async (req, res, next) => {
  const order = await Order.find();

  let totalAmount = 0;
  order.forEach((element) => {
    totalAmount += element.orderPrice;
  });

  res.status(200).json({
    success: true,
    order,
  });
});

const updateStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  product.Stock -= quantity;

  await product.save();
};

const updateOrder = asyncFn(async (req, res, next) => {
  const order = await order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this email id", 404));
  }

  if (order.status === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderItems.forEach(async (order) => {
    await updateStock(order.Product, order.quantity);
  });
  order.status = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();
  res.status(200).json({
    success: true,
    order,
  });
});

const deleteOrder = asyncFn(
  asyncFn(async (req, res, next) => {
    const order = await Order.findById(req.body.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this email id", 404));
    }

    await order.remove();
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  })
);

module.exports = {
  newOrder,
  getSingleOrder,
  getLoggedInUserOrders,
  getAllOrder,
  updateOrder,
  deleteOrder,
};
