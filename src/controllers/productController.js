const prisma = require("../config/prisma");

const createProduct = async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;

    if (!pname || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "pname, price and quantity are required"
      });
    }

    const product = await prisma.product.create({
      data: {
        pname,
        price,
        quantity
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        pid: "asc"
      }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const pid = Number(req.params.id);

    if (Number.isNaN(pid)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

    const product = await prisma.product.findUnique({
      where: { pid }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const pid = Number(req.params.id);

    if (Number.isNaN(pid)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

    const { pname, price, quantity } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { pid }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const product = await prisma.product.update({
      where: { pid },
      data: {
        ...(pname !== undefined && { pname }),
        ...(price !== undefined && { price }),
        ...(quantity !== undefined && { quantity })
      }
    });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const pid = Number(req.params.id);

    if (Number.isNaN(pid)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { pid }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await prisma.product.delete({
      where: { pid }
    });

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};