import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { WeatherData, WeatherDataAPI } from "~/types/WeatherData";
import { aggregateWeatherData } from "~/utils/helpers/aggregateWeatherData";
import { formatDate } from "~/utils/helpers/dateFormatter";
import { getCurrentTimeFormatted } from "~/utils/helpers/getCurrentTimeFormatted";
import { WeatherInfoDetail } from "../WeatherInfoDetail";
import { LineChart } from "../LineChart";
import { ForecastList } from "../ForecastList";

export const WeatherLayout = () => {
  const { config } = useLoaderData();
  const [location, setLocation] = useState<{ lat: number; lon: number }>();
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData[]>();
  const currentTime = getCurrentTimeFormatted();

  const temperatureData = weatherData
    ? [...weatherData.map((item) => item.temperature), 0]
    : [0];
  const lowestTemperatureData = weatherData
    ? [...weatherData.map((item) => item.lowestTemperature), 0]
    : [0];

  const highestTemperatureData = weatherData
    ? [...weatherData.map((item) => item.highestTemperature), 0]
    : [0];

  const labels = weatherData?.map((item) => formatDate(item.date));

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

  const handleSearch = () => {
    // Redirect to the desired page with the city as a parameter
    navigate(`/${city}`);
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
        <>
          <div className="flex flex-col">
            <div className="relative w-96 self-center mb-12">
              <input
                className="w-full h-12 pl-6 pr-12 rounded-full border"
                placeholder="Search City"
                onChange={(e) => setCity(e.target.value)}
              />
              <svg
                onClick={handleSearch}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="absolute cursor-pointer w-6 h-6 text-gray-400 right-3 top-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>

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
          <div className="flex flex-row">
            <div className="w-7/12 h-48 mr-12">
              <LineChart title="Daily forecast" data={data} options={options} />
            </div>
            <div>
              <div className="w-96">
                <ForecastList weatherInfo={weatherData} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
