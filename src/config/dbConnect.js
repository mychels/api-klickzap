import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "klickzap",
};

const pool = mysql.createPool(dbConfig);

export default pool;
