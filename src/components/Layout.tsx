import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./analyzer/Footer";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};