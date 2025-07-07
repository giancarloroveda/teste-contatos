import Request from "../Http/Request";
import Response from "../Http/Response";
import Validator from "../utils/Validator";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import User from "../Models/User";

export default class AuthController {

    async register(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400)
                .end({ message: "Email and password are required" });
        }

        if (!Validator.isString(email) || !Validator.isString(password)) {
            return res.status(400)
                .end({ message: "Email and password must be strings" });
        }

        if (!Validator.isEmail(email)) {
            return res.status(400)
                .end({ message: "Invalid email" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create(email, passwordHash);

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: "7d" }
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production"
            }
        );

        return res.status(200).end({ accessToken, user });
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400)
                .end({ message: "Email and password are required" });
        }

        if (!Validator.isString(email) || !Validator.isString(password)) {
            return res.status(400)
                .end({ message: "Email and password must be strings" });
        }

        if (!Validator.isEmail(email)) {
            return res.status(400)
                .end({ message: "Invalid email" });
        }

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401)
                .end({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401)
                .end({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: "7d" }
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production"
            }
        );

        return res.status(200).end({ accessToken, user });
    }

    async refresh(req: Request, res: Response) {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401)
                .end({ message: "Refresh token is required" });
        }

        try {
            const payload = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET!
            ) as { id: number };

            const accessToken = jwt.sign(
                { id: payload.id },
                process.env.JWT_SECRET!,
                { expiresIn: "15m" }
            );

            return res.status(200).end({ accessToken });
        } catch (error) {
            return res.status(401)
                .end({ message: "Invalid refresh token" });
        }
    }

    async logout(req: Request, res: Response) {
        res.clearCookie("refreshToken");
        return res.status(200).end({ message: "Logout successful" });
    }
}