import { LoaderFunction, json } from "@remix-run/node";
import { V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import type { WeatherData, WeatherDataAPI } from "~/types/WeatherData";

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
            };
          }
        );
        setWeatherData(weatherData);
      }
    }
    fetchWeatherData();
  }, [location, config]);
  return <div>Hello world</div>;
}
