// guardModel.js
// This defines the "guards" table in our database
// Each guard belongs to a company

import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Companies } from "./companyModel.js";

export const Guards = sequelize.define("guards", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Which company this guard belongs to
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Companies,
      key: "id",
    },
  },

  // Guard details
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Unique badge number
  badge: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Day, Night, or Flexible shift
  shift: {
    type: DataTypes.ENUM("Day", "Night", "Flexible"),
    defaultValue: "Day",
  },

  // Area/zone they work in
  zone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Hourly rate in USD
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },

  // Guard rating out of 5
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 5.0,
  },

  // Guard photo URL
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Current status of guard
  status: {
    type: DataTypes.ENUM("available", "on-duty", "suspended"),
    defaultValue: "available",
  },

}, {
  tableName: "guards",
  timestamps: true,
});

// Company has many guards
Companies.hasMany(Guards, { foreignKey: "companyId" });
Guards.belongsTo(Companies, { foreignKey: "companyId" });