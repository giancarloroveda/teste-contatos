import Request from "../Http/Request";
import Response from "../Http/Response";

export default interface ExceptionHandler {
    handle(error: unknown, req: Request, res: Response): void;
}