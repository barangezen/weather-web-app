import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { WeatherLayout } from "~/components/WeatherLayout";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader: LoaderFunction = async () => {
  const apiKey = process.env.API_KEY;

  const config = { apiKey };

  return json({ config });
};

export default function Index() {
  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="w-screen h-16 flex justify-center items-center bg-slate-300 mb-12 ">
          <h1 className="text-3xl font-bold text-sky-700 ">
            Weather forecasts, nowcasts and history in a fast and elegant way
          </h1>
        </div>
        <h2 className="text-2x font-semibold">
          You are currently viewing the weather conditions of the city you are
          currently in. Please enter a city in the search box for another
          location.
        </h2>
        <div className=" w-10/12 mt-12 ">
          <WeatherLayout />
        </div>
      </div>
    </>
  );
}
