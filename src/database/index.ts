import { Sequelize } from 'sequelize';


const { DB_PASS, DB_HOST, DB_NAME, DB_PORT } = process.env;

export const database = new Sequelize({
    dialect: "postgres",
    host: DB_HOST,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT ? +DB_PORT : 5432,
    define: {
        underscored: true
    }
});