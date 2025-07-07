import Request from "../Http/Request";
import Response from "../Http/Response";
import Validator from "../utils/Validator";
import ValidationError from "../Erorrs/ValidationErorr";
import ContactsService from "../Services/ContactsService";

export default class ContactsController {

    constructor(
        private readonly contactsService: ContactsService
    ) {
    }

    async index(req: Request, res: Response) {
        const { personId } = req.query;

        if (!personId) {
            const contacts = await this.contactsService.getAll();
            return res.status(200).end(contacts);
        }

        const contacts = await this.contactsService.getPersonContacts(Number(
            personId));
        return res.status(200).end(contacts);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400)
                .end({ message: "ID is required" });
        }

        const contact = await this.contactsService.getById(Number(id));

        if (!contact) {
            return res.status(404)
                .end({ message: "Contact not found" });
        }

        return res.status(200).end(contact);
    }

    async create(req: Request, res: Response) {
        const { type, description, personId } = req.body;

        if (!type || !description || !personId) {
            return res.status(400)
                .end({ message: "Missing required fields: type, description, personId" });
        }

        if (!Validator.isString(type) || !Validator.isString(description)) {
            return res.status(400)
                .end({ message: "type and description must be strings" });
        }

        const contact = await this.contactsService.create(
            type,
            description,
            Number(personId)
        );
        return res.status(201).end(contact);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { type, description, personId } = req.body;

        if (!id) {
            return res.status(400)
                .end({ message: "ID is required" });
        }

        if (!type || !description || !personId) {
            return res.status(400)
                .end({ message: "Missing required fields: type, description, personId" });
        }

        if (!Validator.isString(type) || !Validator.isString(description)) {
            return res.status(400)
                .end({ message: "type and description must be strings" });
        }

        const contact = await this.contactsService.update(
            Number(id),
            type,
            description,
            Number(personId)
        );

        if (!contact) {
            return res.status(404)
                .end({ message: "Contact not found" });
        }

        return res.status(200).end(contact);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400)
                .end({ message: "ID is required" });
        }

        const contact = await this.contactsService.delete(Number(id));
        if (!contact) {
            return res.status(404)
                .end({ message: "Contact not found" });
        }
        return res.status(200).end(contact);
    }
}