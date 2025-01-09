import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import UrlAnalyzer from "./pages/UrlAnalyzer";
import Settings from "./pages/Settings";
import TestCases from "./pages/TestCases";
import GettingStarted from "./pages/GettingStarted";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<UrlAnalyzer />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/test-cases" element={<TestCases />} />
            <Route path="/getting-started" element={<GettingStarted />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;