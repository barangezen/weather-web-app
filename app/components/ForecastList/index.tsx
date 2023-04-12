import type { WeatherData } from "~/types/WeatherData";
import { formatDate } from "~/utils/helpers/dateFormatter";

interface IForecastList {
  weatherInfo: WeatherData[];
}

export const ForecastList: React.FC<IForecastList> = ({ weatherInfo }) => {
  return (
    <>
      <span className="text-lg font-bold">6-day forecast</span>
      <div className="w-96">
        {weatherInfo.map((item: WeatherData, index: number) => (
          <div
            key={index}
            className="flex flex-row  items-center justify-between "
          >
            <span className="w-28">{formatDate(item.date)}</span>
            <span className="w-32 flex flex-row text-center items-center">
              <img src={item.icon} alt="Weather" />
              {`${item.highestTemperature}/${item.lowestTemperature}°C`}
            </span>
            <span className="w-28 text-xs text-gray-500">
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};
