

import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Users } from "./userModel.js";

export const Companies = sequelize.define("companies", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "id",
    },
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },

}, {
  tableName: "companies",
  timestamps: true,
});

Users.hasOne(Companies, { foreignKey: "userId" });
Companies.belongsTo(Users, { foreignKey: "userId" });