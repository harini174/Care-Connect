import { cn } from "@/lib/utils";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "fas fa-home" },
    { id: "settings", label: "Settings", icon: "fas fa-cog" },
    { id: "history", label: "History", icon: "fas fa-history" }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-heartbeat text-white text-lg"></i>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Care Connect</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 hidden sm:inline">Connected</span>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-2 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "flex flex-col items-center py-3 px-2 rounded-lg transition-colors",
                  currentView === item.id
                    ? "text-primary bg-primary bg-opacity-10"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
                aria-label={item.label}
              >
                <i className={`${item.icon} text-2xl mb-1`}></i>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom padding to account for fixed nav */}
      <div className="h-20"></div>
    </>
  );
}
