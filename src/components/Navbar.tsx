import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PageHeader } from "./analyzer/PageHeader";

export const Navbar = () => {
  const location = useLocation();

  const links = [
    { href: "/", label: "URL Analyzer" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="container mx-auto pt-8 px-4">
      <div className="bg-white border rounded-lg shadow-sm">
        <div>
          <PageHeader />
          <div className="flex h-16 items-center justify-between border-t px-15">
            <div className="flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-gray-600 hover:text-gray-900 transition-colors",
                    location.pathname === link.href && "text-blue-600 font-medium"
                  )}
                >
                  {link.href === "/" ? "URL Analyzer" : link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};