import { useLoaderData } from "@remix-run/react";
import { WeatherLayout } from "~/components/WeatherLayout";
import type { WeatherData } from "~/types/WeatherData";
import { getWeatherData } from "~/utils/api/getWeatherData";

interface LoaderData {
  data: WeatherData[];
}

export const loader = async ({
  params,
}: {
  params: { city: string };
}): Promise<LoaderData> => {
  const { city } = params;
  const weatherData = await getWeatherData(city);

  return { data: weatherData };
};

export default function City() {
  const { data: weatherData } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;
  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="w-screen h-16 flex justify-center items-center bg-slate-300 mb-12 ">
          <h1 className="text-3xl font-bold text-sky-700 ">
            {`Weather Condition in ${weatherData[0].city}`}
          </h1>
        </div>
        <h2 className="text-2x font-semibold">
          You are currently viewing the weather conditions of the{" "}
          {weatherData[0].city}
        </h2>
        <div className=" w-10/12 mt-12 ">
          <WeatherLayout weatherData={weatherData} />
        </div>
      </div>
    </>
  );
}
