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
      <header className="bg-white shadow-md border-b border-border/30 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-heartbeat text-white text-xl"></i>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Care Connect</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-First Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "mobile-nav-item flex flex-col items-center rounded-2xl transition-all duration-300 transform touch-manipulation",
                  currentView === item.id
                    ? "text-white bg-gradient-to-r from-primary to-blue-600 shadow-lg scale-105 border-t-4 border-blue-200"
                    : "text-muted-foreground hover:text-primary hover:bg-muted active:scale-95"
                )}
                aria-label={item.label}
              >
                <i className={`${item.icon} text-3xl mb-2 transition-transform duration-200`}></i>
                <span className="elderly-text-xs font-bold leading-tight">{item.label}</span>
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
