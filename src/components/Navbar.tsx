import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PageHeader } from "./analyzer/PageHeader";

export const Navbar = () => {
  const location = useLocation();

  const links = [
    { href: "/", label: "URL Analyzer" },
    { href: "/test-cases", label: "Test Cases" },
    { href: "/settings", label: "Settings" },
    { href: "/getting-started", label: "Getting Started" },
  ];

  return (
    <nav className="container mx-auto pt-8 px-4">
      <div className="bg-white border rounded-lg shadow-sm">
        <div>
          <PageHeader />
          <div className="flex h-16 items-center justify-between border-t mx-15">
            <div className="flex items-center space-x-8 pl-4">
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
      </div>
    </nav>
  );
};