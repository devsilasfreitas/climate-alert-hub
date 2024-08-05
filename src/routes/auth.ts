import express, { Request } from "express";
import { User } from "../models";
import { checkToken } from "../helpers/checkToken";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { getGoogleUser } from "../helpers/getGoogleUser";
dotenv.config();

const router = express.Router();

router.post("/sign-in", async (req, res) => {
    
    try {
        const { token: tokenGoogle } = req.body;
        
        const userOfGoogle = await getGoogleUser(tokenGoogle);

        if (!userOfGoogle) return res.status(500).json({ msg: "User dont exists "});

        const email = userOfGoogle.email;

        if (!email) return;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            const newUser = await User.create({ email, token: tokenGoogle, theme: "light", reciveEmail: false, city: null, state: null, country: "brazil" });

            const token = jwt.sign({
                id: newUser.id
            }, process.env.JWT_SECRET as string, {
                expiresIn: "1d"
            });

            const userToSend = {
                firstName: userOfGoogle.given_name,
                lastName: userOfGoogle.family_name,
                photoUrl: userOfGoogle.picture,
                email: userOfGoogle.email,
                reciveEmail: newUser.reciveEmail,
                city: newUser.city,
                state: newUser.state,
                country: newUser.country,
                isNewUser: true
            }
            
            return res.status(200).json({ token, user: userToSend });
        }
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET as string, {
            expiresIn: "1d"
        });

        const userToSend = {
            firstName: userOfGoogle.given_name,
            lastName: userOfGoogle.family_name,
            photoUrl: userOfGoogle.picture,
            email: userOfGoogle.email,
            reciveEmail: user.reciveEmail,
            city: user.city,
            state: user.state,
            country: user.country,
            isNewUser: false
        };
        
        return res.status(200).json({ token, user: userToSend });


    } catch (err: any) {
        console.log(err);
        res.status(401).json({ err: err.message });
    }
});

router.use(checkToken);

router.get("/me", (req, res) => {
    const { user } = req.body;
})

router.delete("/me", async (req, res) => {
    const { user } = req.body;

    try {
        await user.destroy();
        return res.status(200);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.put("/me/country", async (req, res) => {
    const { newCountry } = req.body;
    const { user } = req.body;
    try {
        await user.update({ country: newCountry });
        return res.status(200);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.put("/me/theme", async (req, res) => {
    const { user, theme } = req.body;

    try {
        await user.update({ theme });

        return res.status(200).json({ theme });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
});

router.put("/me/recive-email", async (req, res) => {
    const { user, reciveEmail, city, state } = req.body;
    
    try {
        console.log(user.token);

        const userOfGoogle = await getGoogleUser(user.token);

        console.log(userOfGoogle);

        if (!userOfGoogle) return res.send(401).json({ message: "Token expirado! faça login novamente"});


        await user.update({
            reciveEmail,
            city: reciveEmail ? city : null,
            state: reciveEmail ? state : null,
        });

        const userToSend = {
            firstName: userOfGoogle.given_name,
            lastName: userOfGoogle.family_name,
            photoUrl: userOfGoogle.picture,
            email: userOfGoogle.email,
            reciveEmail: user.reciveEmail,
            city: user.city,
            state: user.state,
            country: user.country,
            isNewUser: false
        };

        return res.status(200).json({ user: userToSend });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
});

export { router as auth };
