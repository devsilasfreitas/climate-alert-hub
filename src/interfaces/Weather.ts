interface Day {
    date: string;
    day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        daily_chance_of_rain: number;
        daily_chance_of_snow: number;
        condition: {
            text: string;
            icon: string;
        };
        uv: number;
    };
}

interface Alert {
    headline: string;
    msgtype: string;
    severity: string;
    urgency: string;
    areas: string;
    category: string;
    certainty: string;
    event: string;
    note: string;
    effective: string;
    expires: string;
    desc: string;
    instruction: string;
}

export interface Weather {
    location: {
        name: string;
        lat: number;
        lon: number;
    };
    current: {
        temp_c: number;
        temp_f: number;
        condition: {
            text: string;
            icon: string;
        };
        wind_mph: number;
        wind_kph: number;
    };
    forecast: {
        forecastday: Day[];
    };
    alerts: {
        alert: Alert[];
    };
}
