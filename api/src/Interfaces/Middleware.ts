import Request from "../Http/Request";
import Response from "../Http/Response";

type Middleware = (req: Request, res: Response, next: () => void) => void;

export default Middleware;