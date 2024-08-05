import { Weather } from "../interfaces/Weather";

type Unit = {
    max: "maxtemp_c" | "maxtemp_f",
    min: "mintemp_c" | "mintemp_f"
}

export function averageChanceRain (response: Weather) {

    const days = response.forecast.forecastday;

    return days.map(day => day.day.daily_chance_of_rain).reduce((acc, temp) => acc += temp / 6);
}