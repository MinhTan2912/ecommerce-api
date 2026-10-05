const prisma = require("../config/prisma");

// Thêm sản phẩm vào đơn hàng
const addOrderItem = async (req, res) => {
  try {
    const uid = req.user.uid;
    const oid = Number(req.params.oid);
    const { pid, qty } = req.body;

    if (
      Number.isNaN(oid) ||
      !Number.isInteger(pid) ||
      !Number.isInteger(qty) ||
      qty <= 0
    ) {
      return res.status(400).json({
        message: "Invalid order id, product id or quantity"
      });
    }

    // Kiểm tra Order có thuộc user đang đăng nhập không
    const order = await prisma.order.findFirst({
      where: {
        oid,
        uid
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // Kiểm tra Product
    const product = await prisma.product.findUnique({
      where: {
        pid
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (product.quantity < qty) {
      return res.status(400).json({
        message: "Insufficient product quantity"
      });
    }

    // Không cho thêm cùng Product hai lần vào cùng Order
    const existingItem = await prisma.orderDetail.findUnique({
      where: {
        oid_pid: {
          oid,
          pid
        }
      }
    });

    if (existingItem) {
      return res.status(409).json({
        message: "Product already exists in this order"
      });
    }

    const orderDetail = await prisma.orderDetail.create({
      data: {
        oid,
        pid,
        qty,

        // Giá tại thời điểm đặt hàng
        unitPrice: product.price
      }
    });

    return res.status(201).json({
      message: "Product added to order successfully",
      orderDetail
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// Lấy các sản phẩm trong một Order
const getOrderItems = async (req, res) => {
  try {
    const uid = req.user.uid;
    const oid = Number(req.params.oid);

    if (Number.isNaN(oid)) {
      return res.status(400).json({
        message: "Invalid order id"
      });
    }

    // Kiểm tra Order thuộc user
    const order = await prisma.order.findFirst({
      where: {
        oid,
        uid
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const items = await prisma.orderDetail.findMany({
      where: {
        oid
      },
      include: {
        product: true
      }
    });

    return res.status(200).json(items);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// Cập nhật số lượng sản phẩm trong Order
const updateOrderItem = async (req, res) => {
  try {
    const uid = req.user.uid;
    const oid = Number(req.params.oid);
    const pid = Number(req.params.pid);
    const { qty } = req.body;

    if (
      Number.isNaN(oid) ||
      Number.isNaN(pid) ||
      !Number.isInteger(qty) ||
      qty <= 0
    ) {
      return res.status(400).json({
        message: "Invalid order id, product id or quantity"
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        oid,
        uid
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const item = await prisma.orderDetail.findUnique({
      where: {
        oid_pid: {
          oid,
          pid
        }
      }
    });

    if (!item) {
      return res.status(404).json({
        message: "Order item not found"
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        pid
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (product.quantity < qty) {
      return res.status(400).json({
        message: "Insufficient product quantity"
      });
    }

    const updatedItem = await prisma.orderDetail.update({
      where: {
        oid_pid: {
          oid,
          pid
        }
      },
      data: {
        qty
      }
    });

    return res.status(200).json({
      message: "Order item updated successfully",
      orderDetail: updatedItem
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// Xóa sản phẩm khỏi Order
const deleteOrderItem = async (req, res) => {
  try {
    const uid = req.user.uid;
    const oid = Number(req.params.oid);
    const pid = Number(req.params.pid);

    if (Number.isNaN(oid) || Number.isNaN(pid)) {
      return res.status(400).json({
        message: "Invalid order id or product id"
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        oid,
        uid
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const item = await prisma.orderDetail.findUnique({
      where: {
        oid_pid: {
          oid,
          pid
        }
      }
    });

    if (!item) {
      return res.status(404).json({
        message: "Order item not found"
      });
    }

    await prisma.orderDetail.delete({
      where: {
        oid_pid: {
          oid,
          pid
        }
      }
    });

    return res.status(200).json({
      message: "Product removed from order successfully"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  addOrderItem,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem
};