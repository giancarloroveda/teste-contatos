import Person from "../Models/Person";

export default class PeopleService {
    constructor() {
    }

    insert(name: string, cpf: string) {

    }

    async create(name: string, cpf: string) {
        const formattedCpf = cpf.replace(/[-.]/g, "");
        return await Person.create(name, cpf);
    }

    async getAll() {
        return await Person.getAll();
    }

    async getById(id: number) {
        return await Person.getById(id);
    }

    async update(id: number, name: string, cpf: string) {
        const formattedCpf = cpf.replace(/[-.]/g, "");
        return await Person.update(id, name, formattedCpf);
    }

    async delete(id: number) {
        return await Person.delete(id);
    }
}