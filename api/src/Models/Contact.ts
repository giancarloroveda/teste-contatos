import { db } from "../Database/Database";

export default class Contact {
    static async getById(id: number) {
        const res = await db.query(
            "SELECT * FROM contacts WHERE id = $1",
            [id]
        );
        return res.rows[0] || null;
    }

    static async getAll() {
        const res = await db.query(
            "SELECT contacts.*, people.name as person_name FROM contacts JOIN people ON contacts.person_id = people.id");
        return res.rows;
    }

    static async create(type: string, description: string, personId: number) {
        const res = await db.query(
            "INSERT INTO contacts (type, description, person_id) VALUES ($1, $2, $3) RETURNING *",
            [type, description, personId]
        );
        return res.rows[0];
    }

    static async update(
        id: number,
        type: string,
        description: string,
        personId: number
    ) {
        const res = await db.query(
            "UPDATE contacts SET type = $1, description = $2, person_id = $3 WHERE id = $4 RETURNING *",
            [type, description, personId, id]
        );
        return res.rows[0] || null;
    }

    static async delete(id: number) {
        const res = await db.query(
            "DELETE FROM contacts WHERE id = $1 RETURNING *",
            [id]
        );
        return res.rows[0] || null;
    }

    static async getPersonContacts(personId: number) {
        const res = await db.query(
            "SELECT * FROM contacts WHERE person_id = $1",
            [personId]
        );
        return res.rows;
    }
}