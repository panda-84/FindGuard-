// authController.js
// This file has all the logic for login and register
// Controller = the brain that decides what to do

import { Users } from "../model/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../security/jwt-utils.js";

// ================= REGISTER =================
// This function creates a new user account
export const register = async (req, res) => {
  try {
    // Get all the data sent from frontend
    const { name, email, password, phone, dob, role } = req.body;

    // Check if all required fields are given
    if (!name || !email || !password || !phone || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Make email lowercase so "Test@gmail.com" = "test@gmail.com"
    const normalizedEmail = email.toLowerCase();

    // Check if this email already exists in database
    const existingUser = await Users.findOne({
      where: { email: normalizedEmail },
    });

    // If email already exists, stop and send error
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash (scramble) the password before saving
    // We never save plain passwords in database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to database
    const user = await Users.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      dob,
      role: role || "customer", // ✅ save role, default to customer
    });

    // Send success response
    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // ✅ send role back
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ================= LOGIN =================
// This function checks email and password and returns a token
export const login = async (req, res) => {
  try {
    // Get email and password from frontend
    const { email, password } = req.body;

    // Check if both fields are given
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user by email in database
    const user = await Users.findOne({
      where: { email: email.toLowerCase() },
    });

    // If no user found with this email
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches the hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // ✅ Create token with user info including role
    // Frontend will read this role to redirect to correct page
    const access_token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role, // ✅ role is now in the token
    });

    // Send token and role back to frontend
    res.status(200).json({
      message: "Login successful",
      data: {
        access_token,
        role: user.role, // ✅ send role so frontend can redirect
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// ================= GET ALL USERS =================
// This function returns all users (admin use)
export const getAllUsers = async (req, res) => {
  try {
    // Get all users but hide password
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "phone", "role", "createdAt"],
    });

    res.status(200).json({ data: users });

  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ================= GET USER BY ID =================
// This function returns one user by their ID
export const getUserById = async (req, res) => {
  try {
    // Get the id from the URL (/users/5 → id = 5)
    const { id } = req.params;

    // Find user by primary key (id)
    const user = await Users.findByPk(id, {
      attributes: ["id", "name", "email", "phone", "role", "createdAt"],
    });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ================= UPDATE USER =================
// This function updates user information
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, phone } = req.body;

    // Find user first
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields that were given
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (role) user.role = role;

    // If new password given, hash it before saving
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save changes to database
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= DELETE USER =================
// This function deletes a user by ID
export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user first
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete from database
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting admin accounts
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin accounts" });
    }

    await user.destroy();

    return res.status(200).json({ message: "User deleted successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
