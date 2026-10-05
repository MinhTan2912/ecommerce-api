const prisma = require("../config/prisma");

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    // Lấy uid từ JWT
    const uid = req.user.uid;

    const order = await prisma.order.create({
      data: {
        uid: uid
      }
    });

    return res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// Lấy danh sách đơn hàng của user đang đăng nhập
const getOrders = async (req, res) => {
  try {
    // Lấy uid từ JWT
    const uid = req.user.uid;

    const orders = await prisma.order.findMany({
      where: {
        uid: uid
      },
      orderBy: {
        oid: "asc"
      }
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// Lấy một đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const uid = req.user.uid;
    const oid = Number(req.params.id);

    // Kiểm tra ID hợp lệ
    if (Number.isNaN(oid)) {
      return res.status(400).json({
        message: "Invalid order id"
      });
    }

    // Chỉ cho phép user xem đơn hàng của chính mình
    const order = await prisma.order.findFirst({
      where: {
        oid: oid,
        uid: uid
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};