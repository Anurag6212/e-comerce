const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReview,
  deleteReview,
} = require("../Controller/productController");
const { auth, authorizeRole } = require("../Middleware/auth");

const router = express.Router();

router
  .route("/admin/product/new")
  .post(auth, authorizeRole("admin"), createProduct);

router.route("/product").get(auth, getAllProducts);

router
  .route("/admin/product/:id")
  .put(auth, authorizeRole("admin"), updateProduct)
  .delete(auth, authorizeRole("admin"), deleteProduct)
  .get(auth, getProductDetails);

router.route("/product/:id").get(auth, getProductDetails);

router.route("/review").put(auth, createProductReview);

router.route("/reviews").get(auth, getProductReview).delete(auth, deleteReview);

module.exports = router;
