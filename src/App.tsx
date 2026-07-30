import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BornHome from "./pages/born/Home";
import CreateCapsule from "./pages/born/Create";
import CapsulePage from "./pages/born/Capsule";
import VerifyPage from "./pages/born/Verify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BornHome />} />
          <Route path="/create" element={<CreateCapsule />} />
          <Route path="/c/:token" element={<CapsulePage />} />
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
