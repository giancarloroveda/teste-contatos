import { Client } from "pg";

const clientConfig = process.env.IS_DOCKER === "true" ? {
    connectionString: process.env.DB_URL
} : {
    database: process.env.DATABASE || "postgres",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
};

export const db = new Client(clientConfig);

export async function connect() {
    try {
        await db.connect();
        console.log("Database connected");
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
        } else {
            console.log("Error connecting to database");
        }
    }
}