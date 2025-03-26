import "@/app/globals.css";
import { headers } from "next/headers";

import Navbar from "@/components/navbar";
import WeatherWidget from "@/components/weatherwidget";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "Unknown";

  return (
    <div className="flex bg-background min-h-screen">
      <Navbar />
      <main className="flex-1 md:ml-56 ml-14 bg-background flex flex-col">
        <WeatherWidget ip={ip} />
        {children}
      </main>
    </div>
  );
}
