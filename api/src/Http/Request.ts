import { IncomingMessage } from "node:http";
import Route from "../Interfaces/Route";
import * as cookie from "cookie";

export default class Request {
    public body: { [key: string]: unknown } = {};
    public params: Record<string, string> = {};
    public query: Record<string, string> = {};
    public cookies: Record<string, string | undefined> = {};

    constructor(
        private req: IncomingMessage,
        private route: Route,
    ) {
    }

    get headers() {
        return this.req.headers;
    }

    async init() {
        this.body = await this.getBody();
        this.params = this.getRouteParams();
        this.query = this.getQueryParams();
        this.cookies = this.getCookies();
    }

    async getBody(): Promise<{ [key: string]: unknown }> {
        return new Promise((resolve, reject) => {
            let body = "";

            this.req.on("data", (chunk: string) => {
                body += chunk;
            });

            this.req.on("end", () => {
                if (!body) return resolve({});
                try {
                    const parsedBody = JSON.parse(body);
                    resolve(parsedBody);
                } catch (error) {
                    if (error instanceof Error) {
                        reject({
                            message: "Error parsing request body",
                            error: error.message
                        });
                    }
                }
            });
        });
    }

    getCookies(): Record<string, string | undefined> {
        return cookie.parse(this.req.headers.cookie || "");
    }

    getRouteParams(): Record<string, string> {
        const path = this.req.url?.split("?")[0];
        const paramsArray = path?.split("/");
        const routeParamsArray = this.route.path.split("/");

        const params: Record<string, string> = {};

        if (paramsArray) {
            for (let i = 0; i < paramsArray.length; i++) {
                if (routeParamsArray[i].startsWith(":")) {
                    params[routeParamsArray[i].slice(1)] = paramsArray[i];
                }
            }
        }

        return params;
    }

    getQueryParams(): Record<string, string> {
        const url = this.req.url;
        const queryParamsArray = url?.split("?")[1]?.split("&");

        const params: Record<string, string> = {};

        if (queryParamsArray) {
            for (let i = 0; i < queryParamsArray.length; i++) {
                const [key, value] = queryParamsArray[i].split("=");
                params[key] = value;
            }
        }

        return params;
    }
}