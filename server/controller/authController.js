import { Users } from "../model/userModel.js";
import bcrypt    from "bcrypt";
import crypto    from "crypto";
import nodemailer from "nodemailer";
import { generateToken } from "../security/jwt-utils.js";

const resetTokens = new Map();

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, dob, role } = req.body;
    if (!name || !email || !password || !phone || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizedEmail = email.toLowerCase();
    const existingUser = await Users.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      name, email: normalizedEmail, password: hashedPassword,
      phone, dob, role: role || "customer",
    });
    res.status(201).json({
      message: "User registered successfully",
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await Users.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });
    const access_token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.status(200).json({
      message: "Login successful",
      data: { access_token, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(200).json({ message: "If this email exists, a reset link was sent." });
    }
    const token   = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 15 * 60 * 1000;
    resetTokens.set(token, { userId: user.id, expires });
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"FindGuard" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your FindGuard password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border-radius:12px;background:#0f172a;color:#fff">
          <h2 style="color:#60a5fa">🔒 Password Reset</h2>
          <p>Click the button below to reset your password. Expires in <strong>15 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:16px 0;background:#3b82f6;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:13px">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
    res.status(200).json({ message: "Reset link sent." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reset email." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required." });
    }
    const record = resetTokens.get(token);
    if (!record || record.expires < Date.now()) {
      return res.status(400).json({ message: "Reset link is invalid or has expired." });
    }
    const hashed = await bcrypt.hash(password, 10);
    await Users.update({ password: hashed }, { where: { id: record.userId } });
    resetTokens.delete(token);
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "phone", "role", "createdAt"],
    });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete admin accounts" });
    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};