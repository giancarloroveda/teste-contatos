import * as http from "node:http";
import { IncomingMessage, ServerResponse } from "node:http";
import Request from "./Http/Request";
import Response from "./Http/Response";
import ExceptionHandler from "./Interfaces/ExceptionHandler";
import Middleware from "./Interfaces/Middleware";
import Route from "./Interfaces/Route";
import { Client } from "pg";
import ExceptionHandlerImpl from "./Http/ExceptionHandler";

interface AppConfig {
    exceptionHandler: ExceptionHandler;
}

export class App {
    private server!: http.Server;
    private dbClient!: Client | undefined;

    private globalMiddlewares: Middleware[] = [];
    private routes: Route[] = [];

    constructor(
        private config: AppConfig
    ) {
        this.init();
    }

    init() {
        this.createServer();
    }

    private createServer() {
        this.server = http.createServer(async (
            req: IncomingMessage,
            res: ServerResponse<IncomingMessage>
        ) => {
            res.setHeader(
                "Access-Control-Allow-Origin",
                "http://localhost:5173"
            );
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
            );
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
            );
            res.setHeader("Access-Control-Allow-Credentials", "true");

            if (req.method === "OPTIONS") {
                res.writeHead(204);
                return res.end();
            }

            const currentRoute = this.getCurrentRoute(req);

            if (!currentRoute) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ message: "Route not found" }));
            }

            let request: Request | undefined = undefined;
            let response: Response | undefined = undefined;

            try {
                [request, response] = await Promise.all([
                    this.initRequest(req, currentRoute as Route),
                    this.initResponse(res)
                ]);
            } catch (error) {
                res.statusCode = 500;
                return res.end(JSON.stringify(error));
            }

            if (request && response) {
                try {
                    await this.runMiddlewares(
                        request,
                        response,
                        currentRoute as Route
                    );
                    await (currentRoute as Route).handler(request, response);
                } catch (error) {
                    await new ExceptionHandlerImpl().handle(
                        error,
                        request,
                        response
                    );
                }

            }
        });
    }

    registerRoute(
        method: string,
        path: string,
        middlewares: Middleware[],
        handler: (req: Request, res: Response) => unknown
    ) {
        this.routes.push({
            method,
            path,
            middlewares,
            handler
        });
    }

    registerGlobalMiddleware(middleware: Middleware) {
        this.globalMiddlewares.push(middleware);
    }

    listen(port: number, callback: () => void) {
        this.server.listen(port);
        this.server.on("listening", callback);
    }

    private async initRequest(
        req: IncomingMessage,
        route: Route
    ): Promise<Request> {
        const request = new Request(req, route);
        await request.init();
        return request;
    }

    private async initResponse(res: ServerResponse<IncomingMessage>): Promise<Response> {
        const response = new Response(res);
        await response.init();
        return response;
    }

    private getCurrentRoute(req: IncomingMessage): Route | undefined {
        return this.routes.find(route => {
            if (route.method.toLowerCase() !==
                req.method?.toLowerCase()) return false;

            const reqRouteSplittedPath = req.url?.split("?")[0]?.split("/");
            const routeSplittedPath = route.path.split("/");

            if (routeSplittedPath.length !==
                reqRouteSplittedPath?.length) return false;

            for (let i = 0; i < routeSplittedPath.length; i++) {
                if (routeSplittedPath[i].startsWith(":")) {
                    continue;
                }

                if (routeSplittedPath[i] !== reqRouteSplittedPath?.[i]) {
                    return false;
                }
            }

            return true;
        });
    }

    private async runMiddlewares(req: Request, res: Response, route: Route) {
        return new Promise((resolve, reject) => {
            const middlewares = [
                ...this.globalMiddlewares,
                ...route.middlewares
            ];

            let i = 0;

            const next = () => {
                const mw = middlewares[i++];

                if (mw) {
                    mw(req, res, next);
                } else {
                    resolve(true);
                }
            };

            next();
        });
    }
}