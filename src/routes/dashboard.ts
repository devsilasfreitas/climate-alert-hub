import express from "express";
import { checkToken } from "../helpers/checkToken";
import { getCities } from "../helpers/getCities";
import { averageChanceRain } from "../helpers/averageChanceRain";
import { Weather } from "../interfaces/Weather";
import { getUnitTemperature } from "../helpers/getUnitTemperature";
import { lightFormat, sub } from "date-fns";

const router = express.Router();

router.use(checkToken);

router.get("/", async (req, res) => {
    const { user } = req.body;

    const cities = getCities(user.country);

    try {
        const fiveCitiesNextDays: Weather[] = await Promise.all(
            cities.map((city) =>
                fetch(
                    `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&q=${city}&alerts=true&days=6`
                ).then((res) => res.json())
            )
        );

        const fiveCitiesLastDays: Weather[] = await Promise.all(
            cities.map(async (city) => {
                const today = new Date();
                const startDay = lightFormat(
                    sub(today, {
                        days: 7,
                    }),
                    "yyyy-MM-dd"
                );
                const endDay = lightFormat(
                    sub(today, {
                        days: 1,
                    }),
                    "yyyy-MM-dd"
                );

                return fetch(
                    `http://api.weatherapi.com/v1/history.json?key=${process.env.WEATHERAPI_KEY}&q=${city}&dt=${startDay}&end_dt=${endDay}`
                ).then((res) => res.json());
            })
        );

        // first widget

        const map = fiveCitiesNextDays.map((city) => {
            return {
                lat: city.location.lat,
                lon: city.location.lon,
                name: city.location.name,
                temperature:
                    city.current.temp_c,
            };
        });

        // second widget

        const temperatureCities = fiveCitiesNextDays.map((city) => {
            return {
                name: city.location.name,
                temperature:
                    city.current[
                        getUnitTemperature(user.country) === "Celsius"
                            ? "temp_c"
                            : "temp_f"
                    ],
                unit: getUnitTemperature(user.country).split("")[0],
                condition: city.current.condition.text,
                icon: city.current.condition.icon,
            };
        });

        // third widget

        const nextSixDays = fiveCitiesNextDays.map((city) => {
            return {
                name: city.location.name,
                chanceOfRain: averageChanceRain(city),
            };
        });

        const lastSixDays = fiveCitiesLastDays.map((city) => {
            return {
                name: city.location.name,
                chanceOfRain: averageChanceRain(city),
            };
        });

        let citiesHistory = lastSixDays.map(city => {
            return {
                name: city.name,
                Last: city.chanceOfRain,
                After: nextSixDays.find(currentCity => city.name === currentCity.name)?.chanceOfRain
            };
        });

        return res.status(200).json({
            map,
            temperatureCities,
            graphic: citiesHistory
        });
    } catch (error: any) {
        console.log(error)
    }
});

export { router as dashboard };
