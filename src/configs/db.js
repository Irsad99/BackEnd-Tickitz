const { Pool } = require('pg');
const process = require('process');

const pool = new Pool({
    user: process.env.DB_NAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432
});

module.exports = pool;