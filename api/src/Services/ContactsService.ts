import Person from "../Models/Person";
import Contact from "../Models/Contact";

export default class ContactsService {
    constructor() {
    }

    async create(type: string, description: string, personId: number) {
        return await Contact.create(type, description, personId);
    }

    async getById(id: number) {
        return await Contact.getById(id);
    }

    async update(
        id: number,
        type: string,
        description: string,
        personId: number
    ) {
        return await Contact.update(id, type, description, personId);
    }

    async delete(id: number) {
        return await Contact.delete(id);
    }

    async getPersonContacts(personId: number) {
        return await Contact.getPersonContacts(personId);
    }

    async getAll() {
        return await Contact.getAll();
    }
}