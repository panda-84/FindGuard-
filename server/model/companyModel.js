// companyModel.js
// This defines the "companies" table in our database
// Each company user has one company profile

import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Users } from "./userModel.js";

export const Companies = sequelize.define("companies", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Which user owns this company
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "id",
    },
  },

  // Company name
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Company logo URL
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Where the company is located
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Short description of company
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // Status - pending until admin approves
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },

}, {
  tableName: "companies",
  timestamps: true,
});

// A user has one company
Users.hasOne(Companies, { foreignKey: "userId" });
Companies.belongsTo(Users, { foreignKey: "userId" });