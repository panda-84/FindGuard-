import { Sequelize } from "sequelize";

const isTest = process.env.NODE_ENV === "test";

export const sequelize = isTest
  ? new Sequelize("sqlite::memory:", { logging: false })
  : new Sequelize(
      process.env.DB_NAME || "FindGuard",
      process.env.DB_USER || "postgres",
      process.env.DB_PASS || "2062/9/22",
      {
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: false,
      }
    );

export const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database authenticated successfully.");

    await sequelize.sync();
    console.log("All models synchronized.");

  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
};