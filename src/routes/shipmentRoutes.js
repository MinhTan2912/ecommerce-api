const express = require("express");

const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment
} = require("../controllers/shipmentController");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Tất cả Shipment API đều yêu cầu JWT
router.use(authenticateToken);

// Tạo Shipment
router.post("/", createShipment);

// Lấy danh sách Shipment
router.get("/", getShipments);

// Lấy Shipment theo ID
router.get("/:id", getShipmentById);

// Cập nhật trạng thái Shipment
router.put("/:id", updateShipment);

// Xóa Shipment
router.delete("/:id", deleteShipment);

module.exports = router;