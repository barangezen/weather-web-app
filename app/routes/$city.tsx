import { useLoaderData } from "@remix-run/react";
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

  return <div>Baran</div>;
}
