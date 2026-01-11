import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const Users = sequelize.define("users",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    customerName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    customerEmail:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    customerPassword:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    customerPhone:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    customerDob:{
        type:DataTypes.DATE,
        allowNull:false,
    },

});