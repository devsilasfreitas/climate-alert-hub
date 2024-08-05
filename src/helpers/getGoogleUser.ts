import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

export async function getGoogleUser(token: string) {
    const CLIENTID = process.env.OAUTH_CLIENTID;
    const client = new OAuth2Client(CLIENTID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENTID
    });

    const userOfGoogle = ticket.getPayload();

    return userOfGoogle;
}