const express = require("express");

const {
  createOrder,
  getOrders,
  getOrderById
} = require("../controllers/orderController");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Tất cả Order API đều yêu cầu JWT
router.use(authenticateToken);

// Tạo đơn hàng
router.post("/", createOrder);

// Lấy danh sách đơn hàng của user đang đăng nhập
router.get("/", getOrders);

// Lấy một đơn hàng theo ID
router.get("/:id", getOrderById);

module.exports = router;