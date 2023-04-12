import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { WeatherLayout } from "~/components/WeatherLayout";
import type { WeatherData, WeatherDataAPI } from "~/types/WeatherData";
import { aggregateWeatherData } from "~/utils/helpers/aggregateWeatherData";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader: LoaderFunction = async () => {
  const apiKey = process.env.API_KEY;

  const config = { apiKey };

  return json({ config });
};

export default function Index() {
  const { config } = useLoaderData();
  const [location, setLocation] = useState<{ lat: number; lon: number }>();
  const [weatherData, setWeatherData] = useState<WeatherData[]>();

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
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="w-screen h-16 flex justify-center items-center bg-slate-300 mb-12 ">
          <h1 className="text-3xl font-bold text-sky-700 ">
            Weather forecasts, nowcasts and history in a fast and elegant way
          </h1>
        </div>
        {weatherData ? (
          <>
            <h2 className="text-2x font-semibold">
              You are currently viewing the weather conditions of the city you
              are currently in. Please enter a city in the search box for
              another location.
            </h2>
            <div className=" w-10/12 mt-12 ">
              <WeatherLayout weatherData={weatherData} />
            </div>
          </>
        ) : (
          <div>Loading../</div>
        )}
      </div>
    </>
  );
}
