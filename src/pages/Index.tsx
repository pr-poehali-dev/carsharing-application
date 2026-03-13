import { useState } from "react";
import Icon from "@/components/ui/icon";
import MapView from "@/components/MapView";
import BookingView from "@/components/BookingView";
import TripsView from "@/components/TripsView";
import ProfileView from "@/components/ProfileView";
import SupportChat from "@/components/SupportChat";

type Tab = "map" | "booking" | "trips" | "profile" | "support";

const TABS = [
  { id: "map" as Tab, label: "Карта", icon: "Map" },
  { id: "booking" as Tab, label: "Аренда", icon: "Car" },
  { id: "trips" as Tab, label: "Поездки", icon: "Route" },
  { id: "support" as Tab, label: "Помощь", icon: "MessageCircle" },
  { id: "profile" as Tab, label: "Профиль", icon: "User" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("map");

  return (
    <div
      className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1 flex-shrink-0">
        <span
          className="text-sm font-black tracking-[0.2em]"
          style={{ fontFamily: "Montserrat, sans-serif", color: "var(--drive-green)" }}
        >
          DRIVE
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-dot" />
          <span className="text-xs text-muted-foreground">Москва</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        {(["map", "booking", "trips", "support", "profile"] as Tab[]).map(tab => (
          <div
            key={tab}
            className="absolute inset-0 overflow-hidden transition-opacity duration-300"
            style={{
              opacity: activeTab === tab ? 1 : 0,
              pointerEvents: activeTab === tab ? "auto" : "none",
            }}
          >
            {tab === "map" && <MapView />}
            {tab === "booking" && <BookingView />}
            {tab === "trips" && <TripsView />}
            {tab === "support" && <SupportChat />}
            {tab === "profile" && <ProfileView />}
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div
        className="flex-shrink-0 glass-strong"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-stretch px-2 pb-1">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-3 gap-1 relative transition-all duration-200"
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-b-full"
                    style={{ background: "var(--drive-green)" }}
                  />
                )}
                <Icon
                  name={tab.icon as "Map" | "Car" | "Route" | "MessageCircle" | "User"}
                  size={22}
                  style={{ color: isActive ? "var(--drive-green)" : "rgba(255,255,255,0.35)" }}
                />
                <span
                  className="text-xs font-medium transition-colors"
                  style={{ color: isActive ? "var(--drive-green)" : "rgba(255,255,255,0.35)" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}