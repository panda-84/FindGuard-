import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "FindGuard",        // database name (must exist)
  "postgres",         // username
  "2062/9/22",      // ⚠️ CHANGE to your real password
  {
    host: "127.0.0.1", // IMPORTANT on Windows
    port: 5432,
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