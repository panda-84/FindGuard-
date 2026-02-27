// bookingModel.js
// This defines the "bookings" table
// A customer books a guard from a company

import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Users } from "./userModel.js";
import { Guards } from "./guardModel.js";
import { Companies } from "./companyModel.js";

export const Bookings = sequelize.define("bookings", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Who made the booking (customer)
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Users, key: "id" },
  },

  // Which guard was booked
  guardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Guards, key: "id" },
  },

  // Which company the guard belongs to
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Companies, key: "id" },
  },

  // Booking dates and duration
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  // How long (number)
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // hours / days / months
  durationType: {
    type: DataTypes.ENUM("hours", "days", "months"),
    defaultValue: "hours",
  },

  // Contact details
  contactName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  specialRequirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // Total cost in NPR
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },

  // pending → confirmed or cancelled
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
    defaultValue: "pending",
  },

}, {
  tableName: "bookings",
  timestamps: true,
});

// Set up relationships
Users.hasMany(Bookings,    { foreignKey: "customerId" });
Bookings.belongsTo(Users,  { foreignKey: "customerId", as: "customer" });

Guards.hasMany(Bookings,   { foreignKey: "guardId" });
Bookings.belongsTo(Guards, { foreignKey: "guardId", as: "guard" });

Companies.hasMany(Bookings,    { foreignKey: "companyId" });
Bookings.belongsTo(Companies,  { foreignKey: "companyId", as: "company" });