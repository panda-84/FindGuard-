import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("FindGuard","postgres","2062/9/22",{
    host:"localhost",
    dialect:"postgres",
});

export const connection = () =>{
    try{
        sequelize.sync();
        console.log("Connection has been established successfully.");
    }catch(error){
        console.error("Unable to connect to the database:", error);   
    }
};