export type Country =
    | "brazil"
    | "philippines"
    | "unitedStates"
    | "russia"
    | "mocambique";

export function getCities(country: Country) {
    const cities = {
        brazil: [
            "Brasilia",
            "São Paulo",
            "Salvador",
            "Manaus",
            "Porto Alegre",
        ],
        philippines: ["Manila", "Tacloban", "Cebu", "Davao", "Baguio"],
        unitedStates: [
            "New Orleans",
            "Miami",
            "Houston",
            "Los Angeles",
            "New York",
        ],
        russia: [
            "Moscou",
            "San Petersburg",
            "Vladivostok",
            "Irkutsk",
            "Krasnoyarsk",
        ],
        mocambique: ["Beira", "Maputo", "Nampula", "Quelimane", "Pemba"],
    };

    return cities[country];
}
