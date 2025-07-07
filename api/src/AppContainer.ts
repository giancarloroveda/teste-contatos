import PeopleController from "./Controllers/PeopleController";
import PeopleService from "./Services/PeopleService";
import ContactsService from "./Services/ContactsService";
import ContactsController from "./Controllers/ContactsController";
import AuthController from "./Controllers/AuthController";

function initAppContainer() {
    const peopleService = new PeopleService();
    const contactsService = new ContactsService();

    const peopleController = new PeopleController(peopleService);
    const contactsController = new ContactsController(contactsService);
    const authController = new AuthController();

    return {
        peopleController,
        contactsController,
        authController
    };
}

export default initAppContainer;

