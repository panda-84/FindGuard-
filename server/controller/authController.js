import { Users } from "../model/userModel.js";
import bcrypt from "bcrypt"
import { generateToken } from "../security/jwt-utils.js";


export const register = async (req, res) => {
  try {
    const { name, email, password, phone, dob } = req.body;

    if (!name || !email || !password || !phone || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      name,        // must match model
      email,
      password: hashedPassword,
      phone,
      dob,
    });

    res.status(201).json({
      message: "User registered successfully",
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const access_token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({
      message: "Login successful",
      data: { access_token },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "fullName", "email", "role", "createdAt", "updatedAt"],
    });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, role } = req.body;

    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      data: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id, {
      attributes: ["id", "fullName", "email", "role", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
