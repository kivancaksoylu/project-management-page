import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavbarButtonProps = {
  isExpanded: boolean;
  name: string;
  icon: React.ReactNode;
  route: string;
};

const NavbarButton = ({ isExpanded, name, icon, route }: NavbarButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={route}>
          <button
            className={`flex items-center rounded-md hover:bg-muted hover:border border border-transparent hover:border-muted-hover active:bg-muted transition-all duration-300 w-full ${
              isExpanded
                ? "px-2 py-1.5 justify-start gap-3"
                : "h-9 w-9 justify-center"
            } md:px-2 md:py-1.5 md:justify-start md:gap-3 ${
              isActive
                ? "bg-muted border border-muted-hover"
                : "border border-transparent"
            }`}
          >
            <div className="flex items-center justify-center">{icon}</div>
            <span
              className={`text-sm transition-all duration-300 ${
                !isExpanded ? "w-0 opacity-0" : "w-auto opacity-100"
              } md:inline-block md:w-auto md:opacity-100`}
            >
              {name}
            </span>
            <span className={`sr-only ${!isExpanded && "md:hidden"}`}>
              {name}
            </span>
          </button>
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="hidden [@media(hover:hover)]:block md:hidden"
      >
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default NavbarButton;
