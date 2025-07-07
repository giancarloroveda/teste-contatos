import Request from "./Request";
import Response from "./Response";
import ExceptionHandler from "../Interfaces/ExceptionHandler";
import ValidationError from "../Erorrs/ValidationErorr";

export default class ExceptionHandlerImpl implements ExceptionHandler {
    handle(error: unknown, req: Request, res: Response) {
        if (error instanceof ValidationError) {
            return res.status(error.statusCode).end(error.details);
        }

        if (error instanceof Error) return res.status(400)
            .end({ message: error.message });

        return res.status(500).end({
            message: "Internal server error"
        });
    }
}