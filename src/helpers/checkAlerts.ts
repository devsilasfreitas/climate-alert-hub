import path from "node:path";
import { Weather } from "../interfaces/Weather";
import { User } from "../models"
import { sendMail } from "../nodemailer";
import fs from "node:fs";
import { getUnitTemperature } from "./getUnitTemperature";
import { getUnitVelocity } from "./getUnitVelocity";

type p1 = "note" | "desc" | "instruction" | "headline" | "event"

export async function checkAlerts() {
    const users = await User.findAll({ 
        attributes: {
            include: ["email", "city", "reciveEmail"]
        }
    });

    const variables = {
        note: `Alert of High Temperature in ${"Sao Paulo"}`,
        headline: `The temperature in ${"Sao Paulo"} is ${38} °${"C"}.`,
        event: "High tempeture",
        desc: `A high temperature alert has been issued for ${"Sao Paulo"} due to the ongoing heatwave. Residents are advised to stay indoors, stay hydrated, and avoid strenuous activities outdoors.`,
        instruction: "Ensure you drink plenty of water, use air conditioning or fans if available, and check on elderly or vulnerable neighbors to ensure they are safe.",
    };

    sendMail({
        to: "iagoocsimoes@gmail.com",
        subject: variables.note,
        html: fs.readFileSync(path.resolve(__dirname, 'mails', 'alert.html'), { encoding: 'utf-8'})
        .replace(/{{\s*(\w+)\s*}}/g, (match, p1: p1) => {
            return variables[p1] || match;
        })
    });
    
    users.filter(user => user.reciveEmail).map( async user => {
        
        const weather: Weather = await fetch (`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&q=${user.city} ${user.state}&alerts=yes`).then(res => res.json());
    
        const data = weather.current;
        if (data.temp_c > 37) {
        }
        
        if (data.temp_c < 10) {
            const variables = {
                note: `Alert of Low Temperature in ${weather.location.name}`,
                headline: `The temperature in ${weather.location.name} is ${data[`temp_${getUnitTemperature(user.country) === "Celsius" ? "c" : "f"}`]} °${getUnitTemperature(user.country).split("")[0]}.`,
                event: "Low temperature",
                desc: `A low temperature alert has been issued for ${weather.location.name} due to extreme cold conditions. Residents are advised to stay indoors, dress warmly, and avoid prolonged exposure to the cold.`,
                instruction: "Ensure you wear multiple layers of clothing, keep your home heated, and check on elderly or vulnerable neighbors to ensure they are safe. Avoid travel if possible and take precautions to prevent frostbite and hypothermia."
            };

            sendMail({
                to: "dev.silas.freitas@outlook.com",
                subject: variables.note,
                html: fs.readFileSync(path.resolve(__dirname, 'mails', 'alert.html'), { encoding: 'utf-8'})
                .replace(/{{\s*(\w+)\s*}}/g, (match, p1: p1) => {
                    return variables[p1] || match;
                })
            });
        }

        if (data.wind_kph > 50) {
            const variables = {
                note: `Alert of strong winds in ${weather.location.name}`,
                headline: `Strong winds are expected in ${weather.location.name}, reaching speeds of ${data[`wind_${getUnitVelocity(user.country) === "kph" ? "kph" : "mph"}`]} ${getUnitVelocity(user.country)}.`,
                event: "Strong winds",
                desc: "A strong winds alert has been issued for ${weather.location.name} due to expected high wind speeds. Residents are advised to secure outdoor objects, avoid unnecessary travel, and be cautious of falling debris.",
                instruction: "Ensure that outdoor furniture, trash cans, and other loose items are secured. Stay indoors if possible, and avoid parking under trees or near structures that could be affected by strong winds. Keep updated with local weather reports and emergency instructions."
            };

            sendMail({
                to: user.email,
                subject: variables.note,
                html: fs.readFileSync(path.resolve(__dirname, 'mails', 'alert.html'), { encoding: 'utf-8'})
                    .replace(/{{\s*(\w+)\s*}}/g, (match, p1: p1) => {
                        return variables[p1] || match;
                    })
            });
        }

        if (weather.alerts.alert.length > 0) {
            const alerts = weather.alerts.alert;
            alerts.map(alert => {
                const variables = {
                    note: alert.note,
                    headline: alert.headline,
                    event: alert.event,
                    desc: alert.desc,
                    instruction: alert.instruction,
                }
                sendMail({
                    to: "dev.silas.freitas@outlook.com",
                    subject: alert.note,
                    html: fs.readFileSync(path.resolve(__dirname, 'mails', 'alert.html'), { encoding: 'utf-8'})
                        .replace(/{{\s*(\w+)\s*}}/g, (match, p1: p1) => {
                            return variables[p1] || match;
                        })
                    
                });
            })
        }

    })
}