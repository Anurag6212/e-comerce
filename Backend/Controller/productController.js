const asyncFn = require("../Middleware/asyncErros");
const Product = require("../Model/productModel");
const ErrorHandler = require("../utils/errorHandler");

const createProduct = asyncFn(async (req, res, next) => {
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    product,
  });
});

const getAllProducts = asyncFn(async (req, res, next) => {
  const products = await Product.find();
  return res.status(200).json({
    success: true,
    products,
  });
});

const updateProduct = asyncFn(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  return res.status(200).json({
    success: true,
    product,
  });
});

const deleteProduct = asyncFn(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  await product.remove();
  return res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

const getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler("product not found", 500));
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
};
