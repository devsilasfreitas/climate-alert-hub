import jwt from "jsonwebtoken";

export function generateToken (id: number) {
    const token = jwt.sign({id}, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    });

    return token;
}