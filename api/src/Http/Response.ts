import { ServerResponse } from "node:http";
import * as cookie from "cookie";

export default class Response {
    constructor(
        private res: ServerResponse
    ) {
    }

    init() {
    }

    status(code: number) {
        this.res.statusCode = code;
        return this;
    }

    end(data?: unknown) {
        if (!data) {
            this.res.end();
        }

        if (typeof data === "string") {
            this.res.end(data);
        }

        if (typeof data === "object") {
            this.res.end(JSON.stringify(data));
        }
    }

    cookie(name: string, value: string, options?: cookie.SerializeOptions) {
        const cookieString = cookie.serialize(name, value, options || {});

        this.res.setHeader("Set-Cookie", cookieString);
    }

    clearCookie(name: string) {
        this.cookie(name, "", { maxAge: 0 });
    }
}