import { Country } from "./getCities";

export function getUnitVelocity(country: Country) {
    const unities = {
        brazil: "kph",
        unitedStates: "mph",
        philippines: "kph",
        russia: "kph",
        mocambique: "kph",
    };

    return unities[country];
}
