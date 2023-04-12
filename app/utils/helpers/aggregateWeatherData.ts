import type { WeatherData } from "~/types/WeatherData";
import { findClosestWeather } from "./closestWeather";

export function aggregateWeatherData(
  weatherData: WeatherData[]
): WeatherData[] {
  const aggregatedData: WeatherData[] = [];

  // Group the weather data by date
  const groupedData = weatherData.reduce<{ [date: string]: WeatherData[] }>(
    (result, item) => {
      const date = item.date.split(" ")[0];

      if (!result[date]) {
        result[date] = [];
      }

      result[date].push(item);

      return result;
    },
    {}
  );

  for (const date in groupedData) {
    const data = groupedData[date];
    const freshestData = findClosestWeather(data);
    const currentTempature = freshestData?.temperature;
    const lowestTemps = data.map((item) => item.lowestTemperature);
    const lowestTemperature = Math.min(...lowestTemps);
    const highestTemps = data.map((item) => item.highestTemperature);
    const highestTemperature = Math.max(...highestTemps);

    aggregatedData.push({
      date,
      temperature: currentTempature || 0,
      description: data[0].description,
      icon: data[0].icon,
      city: data[0].city,
      lowestTemperature: Math.round(lowestTemperature),
      feelsLike: Math.round(data[0].feelsLike),
      highestTemperature: Math.round(highestTemperature),
      humidity: data[0].humidity,
      visibility: data[0].visibility / 1000,
      windSpeed: data[0].windSpeed,
      country: data[0].country,
    });
  }

  return aggregatedData;
}
