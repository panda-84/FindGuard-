
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Companies } from "./companyModel.js";

export const Guards = sequelize.define("guards", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Companies,
      key: "id",
    },
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

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

  shift: {
    type: DataTypes.ENUM("Day", "Night", "Flexible"),
    defaultValue: "Day",
  },

  zone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },

  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 5.0,
  },

  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM("available", "on-duty", "suspended"),
    defaultValue: "available",
  },

}, {
  tableName: "guards",
  timestamps: true,
});

Companies.hasMany(Guards, { foreignKey: "companyId" });
Guards.belongsTo(Companies, { foreignKey: "companyId" });