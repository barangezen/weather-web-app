import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import type { WeatherData } from "~/types/WeatherData";
import { formatDate } from "~/utils/helpers/dateFormatter";
import { WeatherInfoDetail } from "../WeatherInfoDetail";
import { LineChart } from "../LineChart";
import { ForecastList } from "../ForecastList";
import type { ChartOptions } from "chart.js";
import { getCurrentTimeFormatted } from "~/utils/helpers/getCurrentTimeFOrmatted";

interface IWeatherLayout {
  weatherData: WeatherData[];
}

export const WeatherLayout: React.FC<IWeatherLayout> = ({ weatherData }) => {
  const [city, setCity] = useState("");
  const navigate = useNavigate();
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

  const options: ChartOptions<"line"> = {
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
    scales: {
      y: {
        beginAtZero: true,
        grace: "5%",
        ticks: {
          callback: (value) => `${value}°C`, // Add °C to the tick labels
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Tempature",
        data: temperatureData,
        borderColor: "rgba(138, 160, 214, 0.8)",
        backgroundColor: "rgba(138, 160, 214, 0.8)",
      },
      {
        label: "Lowest Tempature",
        data: lowestTemperatureData,
        borderColor: "rgba(31, 65, 143, 0.8)",
        backgroundColor: "rgba(31, 65, 143, 0.8)",
      },
      {
        label: "Highest Tempature",
        data: highestTemperatureData,
        borderColor: "rgba(0, 77, 255, 0.8)",
        backgroundColor: "rgba(0, 77, 255, 0.8)",
      },
    ],
  };

  const handleSearch = () => {
    navigate(`/${city.toLocaleLowerCase()}`);
  };

  return (
    <>
      {weatherData ? (
        <>
          <div className="flex flex-col">
            <div className="relative w-96 self-center mb-6">
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
