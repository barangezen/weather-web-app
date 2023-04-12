import { WeatherData } from "~/types/WeatherData";

export const findClosestWeather = (data: WeatherData[]): WeatherData | null => {
  const currentDate = new Date();
  let closestObject = null;
  let closestTimeDifference = Infinity;

  data.forEach((obj) => {
    const objDate = new Date(obj.date);
    const timeDifference = Math.abs(currentDate.getTime() - objDate.getTime());

    if (timeDifference < closestTimeDifference) {
      closestTimeDifference = timeDifference;
      closestObject = obj;
    }
  });

  return closestObject;
};
