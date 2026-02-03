import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import ReviewFeed from "./pages/ReviewFeed";
import AIInsights from "./pages/AIInsights";
import ResponseCenter from "./pages/ResponseCenter";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import AITools from "./pages/AITools";
import Alerts from "./pages/Alerts";
import ReviewFunnels from "./pages/ReviewFunnels";
import SmartRouting from "./pages/SmartRouting";
import QRCampaigns from "./pages/QRCampaigns";
import Competitors from "./pages/Competitors";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reviews" element={<ReviewFeed />} />
            <Route path="/insights" element={<AIInsights />} />
            <Route path="/responses" element={<ResponseCenter />} />
            <Route path="/funnels" element={<ReviewFunnels />} />
            <Route path="/routing" element={<SmartRouting />} />
            <Route path="/campaigns" element={<QRCampaigns />} />
            <Route path="/competitors" element={<Competitors />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
