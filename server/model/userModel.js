
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const Users = sequelize.define("users", {

 
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false, 
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  
  role: {
    type: DataTypes.ENUM("customer", "company", "admin"),
    allowNull: false,
    defaultValue: "customer", 
  },

}, {
  tableName: "users",
  timestamps: true, 
});

