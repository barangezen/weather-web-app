import type {
  WeatherData,
  WeatherDataAPI,
  WeatherResponse,
} from "~/types/WeatherData";
import { aggregateWeatherData } from "../helpers/aggregateWeatherData";

const apiKey = process.env.API_KEY;

export async function getWeatherData(city: string): Promise<WeatherData[]> {
  const geocodingEndpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const geocodingResponse = await fetch(geocodingEndpoint);
  const [{ lat, lon }] = await geocodingResponse.json();

  const forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const forecastResponse = await fetch(forecastEndpoint);
  const forecastData: WeatherResponse = await forecastResponse.json();

  const weatherData: WeatherData[] = forecastData.list.map(
    (item: WeatherDataAPI) => {
      return {
        date: item.dt_txt,
        temperature: Math.round(item.main.temp - 273.15),
        lowestTemperature: Math.round(item.main.temp_min - 273.15),
        highestTemperature: Math.round(item.main.temp_max - 273.15),
        description: item.weather[0].description,
        icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`,
        city: forecastData.city.name,
        humidity: item.main.humidity,
        feelsLike: Math.round(item.main.feels_like),
        visibility: item.visibility / 1000,
        windSpeed: item.wind.speed,
        country: forecastData.city.country,
      };
    }
  );

  return aggregateWeatherData(weatherData);
}
