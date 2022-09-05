import dotenv from "dotenv";
import pg from "pg";
dotenv.config();
var Pool = pg.Pool;
export var connection = new Pool({
    connectionString: process.env.DATABASE_URL
});
