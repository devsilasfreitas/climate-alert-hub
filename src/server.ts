import express from "express";
import { auth } from "./routes/auth";
import { dashboard } from "./routes/dashboard";
import nodeSchedule from "node-schedule";
import { checkAlerts } from "./helpers/checkAlerts";
import { database } from "./database";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

const today = new Date();

const nextEvent = today.setHours(today.getHours() >= 12 ? 0 : 12);

const job = nodeSchedule.scheduleJob(nextEvent, () => {
    setInterval(() => {
        checkAlerts();
    }, 12 * 60 * 60 * 1000);
});

app.use(express.json());

app.use("/auth", auth);

app.use("/dashboard", dashboard);

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => res.send("<h1>Hello World</h1>"));

app.listen(PORT, () => {
    database.authenticate().then(() => {
        console.log("Connection has been established successfully.");
    });
    console.log("Running on port " + PORT);
});

