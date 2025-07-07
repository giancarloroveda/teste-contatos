import { db } from "../Database/Database";

export default class Person {
    static async getById(id: number) {
        const res = await db.query("SELECT * FROM people WHERE id = $1", [id]);
        return res.rows[0] || null;
    }

    static async getAll() {
        const res = await db.query("SELECT * FROM people");
        return res.rows;
    }

    static async create(name: string, cpf: string) {
        const res = await db.query(
            "INSERT INTO people (name, cpf) VALUES ($1, $2) RETURNING *",
            [name, cpf]
        );
        return res.rows[0];
    }

    static async update(id: number, name: string, cpf: string) {
        const res = await db.query(
            "UPDATE people SET name = $1, cpf = $2 WHERE id = $3 RETURNING *",
            [name, cpf, id]
        );
        return res.rows[0];
    }

    static async delete(id: number) {
        const res = await db.query(
            "DELETE FROM people WHERE id = $1 RETURNING *",
            [id]
        );
        return res.rows[0] || null;
    }
}