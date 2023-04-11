import type { WeatherData } from "~/types/WeatherData";

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
    const totalTemp = data.reduce((sum, item) => sum + item.temperature, 0);
    const lowestTemps = data.map((item) => item.lowestTemperature);
    const lowestTemperature = Math.min(...lowestTemps);
    const avgTemp = Math.round(totalTemp / data.length);

    aggregatedData.push({
      date,
      temperature: avgTemp,
      description: data[0].description,
      icon: data[0].icon,
      city: data[0].city,
      lowestTemperature: Math.round(lowestTemperature),
    });
  }

  return aggregatedData;
}