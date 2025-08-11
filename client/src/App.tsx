import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Dashboard } from "@/pages/dashboard";
import { Settings } from "@/pages/settings";
import { History } from "@/pages/history";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderCurrentView = () => {
    switch (currentView) {
      case "settings":
        return <Settings onBack={() => setCurrentView("dashboard")} />;
      case "history":
        return <History onBack={() => setCurrentView("dashboard")} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation 
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
            {renderCurrentView()}
          </main>
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
