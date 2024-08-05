require("dotenv").config();

const { DB_USER, DB_PASS, DB_HOST, DB_NAME, DB_PORT } = process.env;[
console.log(DB_PASS)]
module.exports = {
    development: {
        dialect : 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
    production: {
        dialect: "postgres",
        database: DB_NAME,
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        port: DB_PORT
    }
};