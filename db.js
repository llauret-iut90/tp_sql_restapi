const Pool = require('pg').Pool

const pool = new Pool({
    user: "light",
    host: "localhost",
    database: "tp_sql",
    password: "0000",
    port: 5432
});

module.exports = pool;