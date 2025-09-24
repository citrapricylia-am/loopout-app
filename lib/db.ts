import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 4000), // gunakan 4000 default TiDB
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: true, // penting untuk TiDB Cloud
    // Kalau mau lebih secure, bisa download CA dari TiDB Cloud lalu tambahkan:
    // ca: fs.readFileSync("certs/ca.pem"),
  },
});
