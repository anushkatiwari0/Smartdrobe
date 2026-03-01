export interface WeatherData {
    temperature_c: number;
    condition: string;
    humidity: number;
    feels_like_c: number;
    city: string;
    icon: string;
}

export async function getWeather(city: string): Promise<WeatherData | null> {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey || !city) return null;

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        );
        if (!res.ok) return null;
        const data = await res.json();
        return {
            temperature_c: Math.round(data.main.temp),
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            feels_like_c: Math.round(data.main.feels_like),
            city: data.name,
            icon: data.weather[0].icon,
        };
    } catch {
        return null;
    }
}
