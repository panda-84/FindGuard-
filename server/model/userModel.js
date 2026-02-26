// userModel.js
// This file defines the "users" table in our database
// Every user (customer, company, admin) is stored here

import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

// Define the users table
export const Users = sequelize.define("users", {

  // Unique ID for each user (auto increases: 1, 2, 3...)
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Full name of the user
  name: {
    type: DataTypes.STRING,
    allowNull: false, // required
  },

  // Email address (must be unique - no two users same email)
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // Password (will be hashed/scrambled before saving)
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Phone number
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Date of birth
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  // ✅ NEW - Role tells us what type of user this is
  // customer = normal user who books guards
  // company  = security company who adds guards
  // admin    = super admin who manages everything
  role: {
    type: DataTypes.ENUM("customer", "company", "admin"),
    allowNull: false,
    defaultValue: "customer", // if not given, default is customer
  },

}, {
  tableName: "users",
  timestamps: true, // adds createdAt and updatedAt automatically
});

