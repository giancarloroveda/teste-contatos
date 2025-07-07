import Request from "../Http/Request";
import Response from "../Http/Response";
import PeopleService from "../Services/PeopleService";
import Validator from "../utils/Validator";
import ValidationError from "../Erorrs/ValidationErorr";

export default class PeopleController {

    constructor(
        private readonly peopleService: PeopleService
    ) {
    }

    async index(req: Request, res: Response) {
        const people = await this.peopleService.getAll();
        return res.status(200).end(people);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400)
                .end({ message: "ID is required" });
        }

        const person = await this.peopleService.getById(Number(id));

        if (!person) {
            return res.status(404)
                .end({ message: "Person not found" });
        }

        return res.status(200).end(person);
    }

    async create(req: Request, res: Response) {
        const { name, cpf } = req.body;

        if (!name || !cpf) {
            return res.status(400)
                .end({ message: "Name and CPF are required" });
        }

        if (!Validator.isString(name) || !Validator.isString(cpf)) {
            return res.status(400)
                .end({ message: "Name and CPF must be strings" });
        }

        if (!Validator.isCpf(cpf)) {
            throw new ValidationError(
                "Invalid CPF",
                { location: "cpf", msg: "Invalid CPF" },
                409
            );
        }

        const person = await this.peopleService.create(name, cpf);
        return res.status(201).end(person);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, cpf } = req.body;

        if (!id) {
            return res.status(400)
                .end({ message: "ID is required" });
        }

        if (!name || !cpf) {
            return res.status(400)
                .end({ message: "Name and CPF are required" });
        }

        if (!Validator.isString(name) || !Validator.isString(cpf)) {
            return res.status(400)
                .end({ message: "Name and CPF must be strings" });
        }

        if (!Validator.isCpf(cpf)) {
            throw new ValidationError(
                "Invalid CPF",
                { location: "cpf", msg: "Invalid CPF" },
                409
            );
        }

        const person = await this.peopleService.update(Number(id), name, cpf);
        return res.status(200).end(person);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400)
                .end({ message: "ID is required" });
        }

        const person = await this.peopleService.delete(Number(id));
        if (!person) {
            return res.status(404)
                .end({ message: "Person not found" });
        }
        return res.status(200).end(person);
    }
}