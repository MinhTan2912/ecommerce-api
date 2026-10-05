const prisma = require("../config/prisma");

// Tạo Shipment cho Order
const createShipment = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { oid, status } = req.body;

    if (!Number.isInteger(oid) || !status) {
      return res.status(400).json({
        message: "Order id and status are required"
      });
    }

    // Kiểm tra Order có tồn tại và thuộc user đang đăng nhập
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

    const shipment = await prisma.shipment.create({
      data: {
        oid,
        status
      }
    });

    return res.status(201).json({
      message: "Shipment created successfully",
      shipment
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// Lấy Shipment của user đang đăng nhập
const getShipments = async (req, res) => {
  try {
    const uid = req.user.uid;

    const shipments = await prisma.shipment.findMany({
      where: {
        order: {
          uid
        }
      },
      include: {
        order: true
      },
      orderBy: {
        shipid: "asc"
      }
    });

    return res.status(200).json(shipments);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// Lấy Shipment theo ID
const getShipmentById = async (req, res) => {
  try {
    const uid = req.user.uid;
    const shipid = Number(req.params.id);

    if (Number.isNaN(shipid)) {
      return res.status(400).json({
        message: "Invalid shipment id"
      });
    }

    const shipment = await prisma.shipment.findFirst({
      where: {
        shipid,
        order: {
          uid
        }
      },
      include: {
        order: true
      }
    });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found"
      });
    }

    return res.status(200).json(shipment);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// Cập nhật trạng thái Shipment
const updateShipment = async (req, res) => {
  try {
    const uid = req.user.uid;
    const shipid = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(shipid) || !status) {
      return res.status(400).json({
        message: "Shipment id and status are required"
      });
    }

    const shipment = await prisma.shipment.findFirst({
      where: {
        shipid,
        order: {
          uid
        }
      }
    });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found"
      });
    }

    const updatedShipment = await prisma.shipment.update({
      where: {
        shipid
      },
      data: {
        status
      }
    });

    return res.status(200).json({
      message: "Shipment updated successfully",
      shipment: updatedShipment
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// Xóa Shipment
const deleteShipment = async (req, res) => {
  try {
    const uid = req.user.uid;
    const shipid = Number(req.params.id);

    if (Number.isNaN(shipid)) {
      return res.status(400).json({
        message: "Invalid shipment id"
      });
    }

    const shipment = await prisma.shipment.findFirst({
      where: {
        shipid,
        order: {
          uid
        }
      }
    });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found"
      });
    }

    await prisma.shipment.delete({
      where: {
        shipid
      }
    });

    return res.status(200).json({
      message: "Shipment deleted successfully"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment
};