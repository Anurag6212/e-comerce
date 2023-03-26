const express = require("express");
const {
  newOrder,
  getSingleOrder,
  getLoggedInUserOrders,
  getAllOrder,
  updateOrder,
  deleteOrder,
} = require("../Controller/orderController");
const { auth, authorizeRole } = require("../Middleware/auth");

const router = express.Router();

router.route("/order/create").post(auth, newOrder);

router.route("/order/:id").get(auth, getSingleOrder);

router.route("/orders/me").post(auth, getLoggedInUserOrders);

router.route("/admin/orders").get(auth, authorizeRole("admin"), getAllOrder);

router
  .route("/admin/order/:id")
  .put(auth, authorizeRole("admin"), updateOrder)
  .delete(auth, authorizeRole("admin"), deleteOrder);

module.exports = router;
