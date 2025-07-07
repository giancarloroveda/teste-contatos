import Request from "../Http/Request";
import Response from "../Http/Response";
import * as jwt from "jsonwebtoken";

export default async function AuthMiddleware(
    req: Request,
    res: Response,
    next
) {
    const { authorization } = req.headers;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).end({ message: "Unauthorized" });
    }

    const token = authorization.split(" ")[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        next();
    } catch (error) {
        return res.status(401).end({ message: "Invalid or expired token" });
    }
}
