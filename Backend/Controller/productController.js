const asyncFn = require("../Middleware/asyncErros");
const Product = require("../Model/productModel");
const ApiFeatues = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

const createProduct = asyncFn(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    product,
  });
});

const getAllProducts = asyncFn(async (req, res, next) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatues(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  const filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;
  return res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
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

const getProductDetails = asyncFn(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

const createProductReview = asyncFn(async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const review = {
    id: req.user._id,
    name: req.user.name,
    rating: +rating,
    comment,
  };
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  const isReviewed = product.reviews.find(
    (res) => res?.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((res) => {
      if (res?.user.toString() === req.user._id.toString()) {
        res.comment = comment;
        res.rating = rating;
      }
    });
  } else {
    product.reviews.unshift(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((res) => {
    avg += res.rating;
  });
  product.rating = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
    product,
  });
});

const getProductReview = asyncFn(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  const reviews = product.reviews;
  return res.status(200).json({
    success: true,
    reviews,
  });
});

const deleteReview = asyncFn(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  const reviews = product.reviews.filter(
    (res) => res._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((res) => {
    avg += res.rating;
  });
  const rating = avg / product.reviews.length;
  const numOfReviews = reviews.length;

  await product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      numOfReviews,
      rating,
    },
    {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReview,
  deleteReview,
};
