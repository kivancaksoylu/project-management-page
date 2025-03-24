"use client";
import "@/app/globals.css";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  ChevronRight,
  Search,
} from "lucide-react";

import { useState, useEffect } from "react";
import NavbarButton from "@/components/navbar/navbarButton";

type NavSection = {
  title: string;
  items: {
    name: string;
    icon: React.ReactNode;
    route: string;
  }[];
};

const navigationData: NavSection[] = [
  {
    title: "General",
    items: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        route: "/dashboard",
      },
      {
        name: "Projects",
        icon: <FolderKanban size={20} />,
        route: "/",
      },
    ],
  },
  {
    title: "Others",
    items: [
      {
        name: "Schedule",
        icon: <Calendar size={20} />,
        route: "/schedule",
      },
    ],
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#fafafa] min-h-screen">
      <NavBar />
      <main className="flex-1 md:ml-56 ml-14 bg-[#fafafa] flex flex-col">
        {children}
      </main>
    </div>
  );
}

function NavBar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsExpanded(window.innerWidth >= 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const filteredNavigation = navigationData
    .map((section) => ({
      title: section.title,
      items: section.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 flex flex-col border-r border-[#e8e8e8] bg-[#fafafa] transition-width duration-300 ${
        isExpanded ? "w-56" : "w-14"
      } md:w-56`}
    >
      <nav className="flex flex-col  px-2 py-5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent active:bg-accent/80 self-end"
        >
          <ChevronRight
            size={20}
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className={`relative ${!isExpanded && "hidden"} md:block mb-4`}>
          <Search
            size={16}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md bg-[#f5f5f5] border border-[#e2e2e2] pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#e2e2e2]"
          />
        </div>

        {filteredNavigation.map((section, index) => (
          <div key={section.title} className="flex flex-col">
            <div
              className={`text-xs font-semibold text-muted-foreground ${
                !isExpanded ? "h-0 overflow-hidden m-0 p-0" : "mb-2"
              } md:block md:h-auto`}
            >
              {section.title}
            </div>

            <div className="flex flex-col gap-2">
              {section.items.map((item) => (
                <NavbarButton
                  key={item.name}
                  isExpanded={isExpanded}
                  name={item.name}
                  icon={item.icon}
                  route={item.route}
                />
              ))}
            </div>

            {index < filteredNavigation.length - 1 && (
              <div className="h-px w-full bg-[#e8e8e8] my-2"></div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
