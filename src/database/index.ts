import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

const { DB_PASS, DB_HOST, DB_NAME, DB_PORT, DB_USER } = process.env;

export const database = new Sequelize({
    dialect: "postgres",
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT ? +DB_PORT : 5432,
    define: {
        underscored: true
    }
});