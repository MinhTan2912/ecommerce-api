const express = require("express");

const {
  addOrderItem,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem
} = require("../controllers/orderDetailController");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Tất cả OrderDetail API đều yêu cầu JWT
router.use(authenticateToken);

// Thêm sản phẩm vào Order
router.post("/:oid/items", addOrderItem);

// Lấy danh sách sản phẩm trong Order
router.get("/:oid/items", getOrderItems);

// Cập nhật số lượng sản phẩm trong Order
router.put("/:oid/items/:pid", updateOrderItem);

// Xóa sản phẩm khỏi Order
router.delete("/:oid/items/:pid", deleteOrderItem);

module.exports = router;