import { db } from "../Database/Database";

export default class User {
    static async create(email: string, password: string) {
        const res = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, password]
        );
        return res.rows[0];
    }

    static async findByEmail(email: string) {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return res.rows[0] || null;
    }
}