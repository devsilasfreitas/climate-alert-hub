import { Country } from "./getCities";

export function getUnitTemperature(country: Country) {
    const unities = {
        brazil: "Celsius",
        unitedStates: "Fahrenheit",
        philippines: "Celsius",
        russia: "Celsius",
        mocambique: "Celsius",
    };

    return unities[country];
}
