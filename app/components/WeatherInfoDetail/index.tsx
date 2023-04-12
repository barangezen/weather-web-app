interface IWeatherInfoDetail {
  icon: string;
  tempature: number;
  description: string;
  windSpeed: number;
  humidity: number;
  lowestTemperature: number;
  highestTemperature: number;
}

export const WeatherInfoDetail: React.FC<IWeatherInfoDetail> = ({
  icon,
  tempature,
  description,
  windSpeed,
  humidity,
  lowestTemperature,
  highestTemperature,
}) => {
  return (
    <>
      <div className="flex items-center">
        <img src={icon} alt="Weather" />
        <span className="text-3xl font-semi-bold">{`${tempature}°C `}</span>
      </div>
      <span className="text-sm font-bold">{`Feels Like ${tempature}°C, ${description}`}</span>
      <div className="flex h-16">
        <span className="block w-0.5  bg-orange-500 mr-4" />

        <ul className="grid grid-cols-2 gap-4">
          <li>{`Wind Speed: ${windSpeed}m/s`}</li>
          <li>{`Humadity: ${humidity}%`}</li>
          <li>{`Lowest Temperature: ${lowestTemperature}°C`}</li>
          <li>{`Highest Temperature: ${highestTemperature}°C`}</li>
        </ul>
      </div>
    </>
  );
};
