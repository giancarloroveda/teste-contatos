import { App } from "./App";
import ExceptionHandlerImpl from "./Http/ExceptionHandler";
import dotenv from "dotenv";
import { connect } from "./Database/Database";
import initAppContainer from "./AppContainer";
import AuthMiddleware from "./Middlewares/AuthMiddleware";

dotenv.config();


async function bootstrap() {
    await connect();
    initApp();
}

function initApp() {
    const {
        peopleController,
        contactsController,
        authController
    } = initAppContainer();

    const app: App = new App({
        exceptionHandler: new ExceptionHandlerImpl()
    });

    app.registerRoute(
        "GET",
        "/test-connection",
        [],
        (req, res) => {
            res.end({
                message: "API works"
            });
        }
    );

    app.registerRoute(
        "POST",
        "/register",
        [],
        authController.register.bind(authController)
    );
    app.registerRoute(
        "POST",
        "/login",
        [],
        authController.login.bind(authController)
    );
    app.registerRoute(
        "POST",
        "/refresh",
        [],
        authController.refresh.bind(authController)
    );
    app.registerRoute(
        "POST",
        "/logout",
        [AuthMiddleware],
        authController.logout.bind(authController)
    );

    app.registerRoute(
        "GET",
        "/people",
        [AuthMiddleware],
        peopleController.index.bind(peopleController)
    );
    app.registerRoute(
        "GET",
        "/people/:id",
        [AuthMiddleware],
        peopleController.show.bind(peopleController)
    );
    app.registerRoute(
        "POST",
        "/people",
        [AuthMiddleware],
        peopleController.create.bind(peopleController)
    );
    app.registerRoute(
        "PUT",
        "/people/:id",
        [AuthMiddleware],
        peopleController.update.bind(peopleController)
    );
    app.registerRoute(
        "DELETE",
        "/people/:id",
        [AuthMiddleware],
        peopleController.delete.bind(peopleController)
    );

    app.registerRoute(
        "GET",
        "/contacts",
        [AuthMiddleware],
        contactsController.index.bind(contactsController)
    );
    app.registerRoute(
        "GET",
        "/contacts/:id",
        [AuthMiddleware],
        contactsController.show.bind(contactsController)
    );
    app.registerRoute(
        "POST",
        "/contacts",
        [AuthMiddleware],
        contactsController.create.bind(contactsController)
    );
    app.registerRoute(
        "PUT",
        "/contacts/:id",
        [AuthMiddleware],
        contactsController.update.bind(contactsController)
    );
    app.registerRoute(
        "DELETE",
        "/contacts/:id",
        [AuthMiddleware],
        contactsController.delete.bind(contactsController)
    );

    app.listen(8000, () => {
        console.log("Server running at http://localhost:8000");
    });
}

bootstrap();


