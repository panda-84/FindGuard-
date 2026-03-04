
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Users }     from "./userModel.js";
import { Guards }    from "./guardModel.js";
import { Companies } from "./companyModel.js";

export const Bookings = sequelize.define("bookings", {

  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  customerId: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: Users, key: "id" },
  },

  guardId: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: Guards, key: "id" },
  },

  companyId: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: Companies, key: "id" },
  },

  startDate:    { type: DataTypes.DATE,    allowNull: false },
  duration:     { type: DataTypes.INTEGER, allowNull: false },
  durationType: { type: DataTypes.ENUM("hours", "days", "months"), defaultValue: "hours" },

  contactName:         { type: DataTypes.STRING, allowNull: false },
  contactPhone:        { type: DataTypes.STRING, allowNull: false },
  contactEmail:        { type: DataTypes.STRING, allowNull: false },
  address:             { type: DataTypes.TEXT,   allowNull: false },
  specialRequirements: { type: DataTypes.TEXT,   allowNull: true  },

  totalCost: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

  // ✅ Added "completed" status
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
    defaultValue: "pending",
  },

}, { tableName: "bookings", timestamps: true });

// Associations
Users.hasMany(Bookings,       { foreignKey: "customerId" });
Bookings.belongsTo(Users,     { foreignKey: "customerId", as: "customer" });

Guards.hasMany(Bookings,      { foreignKey: "guardId" });
Bookings.belongsTo(Guards,    { foreignKey: "guardId",   as: "guard" });

Companies.hasMany(Bookings,   { foreignKey: "companyId" });
Bookings.belongsTo(Companies, { foreignKey: "companyId", as: "company" });