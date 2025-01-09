import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const location = useLocation();

  const links = [
    { href: "/", label: "URL Analyzer" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
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
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};