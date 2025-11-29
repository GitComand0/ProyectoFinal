import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "db",  // <--- Debe ser "db", no localhost
    database: process.env.DB_NAME || "gymstore",
    password: process.env.DB_PASS || "postgres",
    port: process.env.DB_PORT || 5432,
});

export default pool;
