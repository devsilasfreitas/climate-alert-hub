import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

export async function checkToken (req: Request, res: Response, next: NextFunction) {

    console.log(req.headers);

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Token not found" });
    }
    try {
        const token = authorization.split(" ")[1];
        // @ts-ignore
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(id);

        if (!user) return res.status(402).json({ error: "User not found" });
        // @ts-ignore
        req.body.user = user;
        next();
    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }
}