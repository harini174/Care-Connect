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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/30 px-4 py-2 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "flex flex-col items-center py-4 px-3 rounded-2xl transition-all duration-300 transform",
                  currentView === item.id
                    ? "text-white bg-gradient-to-r from-primary to-blue-600 shadow-lg scale-105"
                    : "text-muted-foreground hover:text-primary hover:bg-muted hover:scale-105"
                )}
                aria-label={item.label}
              >
                <i className={`${item.icon} text-2xl mb-1`}></i>
                <span className="text-sm font-semibold">{item.label}</span>
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
