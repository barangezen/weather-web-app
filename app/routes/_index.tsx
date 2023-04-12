import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

import { useState, useEffect } from "react";
import { LineChart } from "~/components/LineChart";
import { WeatherInfoDetail } from "~/components/WeatherInfoDetail";
import type { WeatherData, WeatherDataAPI } from "~/types/WeatherData";
import { aggregateWeatherData } from "~/utils/helpers/aggregateWeatherData";
import { formatDate } from "~/utils/helpers/dateFormatter";
import { getCurrentTimeFormatted } from "~/utils/helpers/getCurrentTimeFormatted";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader: LoaderFunction = async () => {
  const apiKey = process.env.API_KEY;

  const config = { apiKey };

  return json({ config });
};

export default function Index() {
  const { config } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const [location, setLocation] = useState<{ lat: number; lon: number }>();
  const [weatherData, setWeatherData] = useState<WeatherData[]>();
  const currentTime = getCurrentTimeFormatted();
  const date = formatDate("2023-04-12");

  const temperatureData = weatherData
    ? [...weatherData.map((item) => item.temperature), 0]
    : [0];
  const lowestTemperatureData = weatherData
    ? [...weatherData.map((item) => item.lowestTemperature), 0]
    : [0];

  const highestTemperatureData = weatherData
    ? [...weatherData.map((item) => item.highestTemperature), 0]
    : [0];

  const labels = weatherData?.map((item) => item.date);

  console.log("weather data", weatherData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Hourly forecast ",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Tempature",
        data: temperatureData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Lowest Tempature",
        data: lowestTemperatureData,
        borderColor: "rgb(100, 65, 80)",
        backgroundColor: "rgba(149, 35, 132, 0.5)",
      },
      {
        label: "Highest Tempature",
        data: highestTemperatureData,
        borderColor: "rgb(50, 175, 48)",
        backgroundColor: "rgba(149, 35, 132, 0.5)",
      },
    ],
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    async function fetchWeatherData() {
      if (location && config.apiKey) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${config?.apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        const weatherData: WeatherData[] = data.list.map(
          (item: WeatherDataAPI) => {
            return {
              date: item.dt_txt,
              temperature: Math.round(item.main.temp),
              description: item.weather[0].description,
              icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`,
              city: data.city.name,
              lowestTemperature: item.main.temp_min,
              highestTemperature: item.main.temp_max,
              humidity: item.main.humidity,
              feelsLike: item.main.feels_like,
              visibility: item.visibility,
              windSpeed: item.wind.speed,
              country: data.city.country,
            };
          }
        );
        const aggregatedData = aggregateWeatherData(weatherData);
        setWeatherData(aggregatedData);
      }
    }
    fetchWeatherData();
  }, [location, config]);
  return (
    <>
      {weatherData ? (
        <div className="container mx-auto">
          hello world!
          <div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-orange-500">
                {currentTime}
              </span>

              <span className="text-xl font-bold">
                {`${weatherData[0].city}, ${weatherData[0].country}`}
              </span>
            </div>
            <div className="mb-6">
              <WeatherInfoDetail
                icon={weatherData[0].icon}
                tempature={weatherData[0].temperature}
                description={weatherData[0].description}
                windSpeed={weatherData[0].windSpeed}
                humidity={weatherData[0].humidity}
                lowestTemperature={weatherData[0].lowestTemperature}
                highestTemperature={weatherData[0].highestTemperature}
              />
            </div>
            <div className="w-1/2">
              <LineChart title="Daily forecast" data={data} options={options} />
            </div>
          </div>
        </div>
      ) : (
        <div>Hello World!</div>
      )}
    </>
  );
}
