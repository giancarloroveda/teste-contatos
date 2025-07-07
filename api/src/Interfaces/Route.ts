import Middleware from "./Middleware";
import Request from "../Http/Request";
import Response from "../Http/Response";

export default interface Route {
    method: string,
    path: string,
    middlewares: Middleware[],
    handler: (req: Request, res: Response) => unknown
}