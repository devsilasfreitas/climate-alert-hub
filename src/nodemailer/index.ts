import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export function sendMail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
    };

    return transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            throw new Error(err.message);
            console.log(err);
        }
    });
}
