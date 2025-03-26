"use client";
import { useState } from "react";
import {
  Loader2,
  Sun,
  Cloud,
  CloudRain,
  CloudFog,
  CloudLightning,
  CloudSnow,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherByIp } from "@/app/api/api";

const getWeatherDetails = (condition: string) => {
  const lowercaseCondition = condition.toLowerCase();

  if (
    lowercaseCondition.includes("sun") ||
    lowercaseCondition.includes("clear")
  ) {
    return {
      icon: <Sun className="w-6 h-6 text-orange-500" />,
      colorClass: "text-orange-500",
    };
  }
  if (lowercaseCondition.includes("rain")) {
    return {
      icon: <CloudRain className="w-6 h-6 text-blue-500" />,
      colorClass: "text-blue-500",
    };
  }
  if (lowercaseCondition.includes("cloud")) {
    return {
      icon: <Cloud className="w-6 h-6 text-gray-500" />,
      colorClass: "text-gray-500",
    };
  }
  if (
    lowercaseCondition.includes("fog") ||
    lowercaseCondition.includes("mist")
  ) {
    return {
      icon: <CloudFog className="w-6 h-6 text-gray-400" />,
      colorClass: "text-gray-400",
    };
  }
  if (
    lowercaseCondition.includes("thunder") ||
    lowercaseCondition.includes("lightning")
  ) {
    return {
      icon: <CloudLightning className="w-6 h-6 text-yellow-500" />,
      colorClass: "text-yellow-500",
    };
  }
  if (lowercaseCondition.includes("snow")) {
    return {
      icon: <CloudSnow className="w-6 h-6 text-cyan-500" />,
      colorClass: "text-cyan-500",
    };
  }

  return {
    icon: <Sun className="w-6 h-6 text-orange-500" />,
    colorClass: "text-orange-500",
  };
};

const WeatherWidget = ({ ip }: { ip: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: weather, isLoading } = useQuery({
    queryKey: ["weather", ip],
    queryFn: () => getWeatherByIp(ip),
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (!weather && !isLoading) return null;

  const weatherDetails = weather ? getWeatherDetails(weather.condition) : null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "w-80" : "w-12 h-12"
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`bg-white/90 backdrop-blur-sm border border-gray-200 
            shadow-lg w-full overflow-hidden transition-all duration-300 
            hover:shadow-md hover:bg-white/95
            ${
              isExpanded
                ? "p-4 rounded-xl"
                : "p-2 h-12 aspect-square rounded-full"
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            </div>
          ) : isExpanded ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {weather?.location}
                </h3>
                <div className="flex items-center gap-2">
                  {weatherDetails?.icon}
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {weather?.condition}
                    </p>
                    <span className={`text-lg font-bold ${weatherDetails?.colorClass}`}>
                      {weather?.temperature}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Humidity</span>
                  <span className="font-medium text-gray-900">
                    {weather?.humidity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Wind</span>
                  <span className="font-medium text-gray-900">
                    {weather?.windSpeed}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              {weatherDetails?.icon}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default WeatherWidget;
