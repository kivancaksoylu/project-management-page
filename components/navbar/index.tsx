"use client";
import { useState, useEffect, useMemo } from "react";
import NavbarButton from "@/components/navbar/navbarButton";
import { useStore } from "zustand";
import { taskStore } from "@/store/taskStore";
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  ChevronRight,
  Search,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  route: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

interface ClientNavBarProps {}

type NavSectionWhole = {
  title: string;
  items: {
    name: string;
    icon: React.ReactNode;
    route: string;
  }[];
};

export default function ClientNavBar({}: ClientNavBarProps) {
  const search = useStore(taskStore, (state) => state.search);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigationData: NavSectionWhole[] = useMemo(
    () => [
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
            route: `/${search ? `?search=${search}` : ""}`,
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
    ],
    [search],
  );

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
          section.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 flex flex-col border-r border-border bg-background transition-width duration-300 ${
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
            className="w-full rounded-md bg-muted border border-border-input pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-border-input"
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
              <div className="h-px w-full bg-border my-2"></div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
