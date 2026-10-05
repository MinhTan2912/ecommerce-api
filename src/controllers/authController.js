const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, fullname, password } = req.body;

    if (!username || !fullname || !password) {
      return res.status(400).json({
        message: "Username, fullname and password are required"
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }

    const role = await prisma.role.findFirst({
      where: { roleName: "USER" }
    });

    const membership = await prisma.memberShip.findFirst({
      where: { mname: "NORMAL" }
    });

    if (!role || !membership) {
      return res.status(500).json({
        message: "Default role or membership not found"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        fullname,
        password: hashedPassword,
        roleId: role.roleId,
        mid: membership.mid
      },
      select: {
        uid: true,
        username: true,
        fullname: true,
        roleId: true,
        mid: true
      }
    });

    return res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        uid: user.uid,
        username: user.username,
        role: user.role.roleName
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        uid: user.uid,
        username: user.username,
        fullname: user.fullname,
        role: user.role.roleName
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  register,
  login
};

