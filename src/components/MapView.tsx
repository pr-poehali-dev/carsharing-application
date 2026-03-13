import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Car {
  id: number;
  x: number;
  y: number;
  model: string;
  brand: string;
  class: "eco" | "comfort" | "business";
  fuel: number;
  km: number;
  transmission: string;
  plate: string;
  available: boolean;
}

interface Partner {
  id: number;
  x: number;
  y: number;
  type: "gas" | "wash" | "service";
  name: string;
  discount: string;
  bonus: string;
}

interface ParkingZone {
  id: number;
  x: number;
  y: number;
  label: string;
  demand: "high" | "medium";
}

const CARS: Car[] = [
  { id: 1, x: 30, y: 35, model: "Camry", brand: "Toyota", class: "comfort", fuel: 78, km: 312, transmission: "AT", plate: "А234ВС77", available: true },
  { id: 2, x: 55, y: 25, model: "Model 3", brand: "Tesla", class: "business", fuel: 91, km: 410, transmission: "AT", plate: "В567ДЕ77", available: true },
  { id: 3, x: 70, y: 55, model: "Polo", brand: "VW", class: "eco", fuel: 54, km: 186, transmission: "MT", plate: "К102ОП99", available: true },
  { id: 4, x: 20, y: 65, model: "Rapid", brand: "Skoda", class: "eco", fuel: 33, km: 89, transmission: "AT", plate: "Е321РС97", available: false },
  { id: 5, x: 80, y: 30, model: "E-Class", brand: "Mercedes", class: "business", fuel: 86, km: 522, transmission: "AT", plate: "Х455УФ77", available: true },
];

const PARTNERS: Partner[] = [
  { id: 1, x: 45, y: 15, type: "gas", name: "Газпром Нефть", discount: "-90%", bonus: "+15 баллов" },
  { id: 2, x: 15, y: 45, type: "gas", name: "Лукойл", discount: "-75%", bonus: "+10 баллов" },
  { id: 3, x: 65, y: 75, type: "wash", name: "AutoSpa", discount: "Бесплатно", bonus: "+5 баллов" },
  { id: 4, x: 85, y: 60, type: "service", name: "КЛЮЧАВТО СТО", discount: "-50%", bonus: "+20 баллов" },
];

const PARKING_ZONES: ParkingZone[] = [
  { id: 1, x: 38, y: 48, label: "ТЦ Мега", demand: "high" },
  { id: 2, x: 60, y: 38, label: "Бизнес-центр", demand: "high" },
  { id: 3, x: 25, y: 78, label: "Гостиница", demand: "medium" },
];

const classColors: Record<string, string> = {
  eco: "#22c55e",
  comfort: "#3b82f6",
  business: "#f59e0b",
};

const classLabels: Record<string, string> = {
  eco: "Эко",
  comfort: "Комфорт",
  business: "Бизнес",
};

const partnerIcons: Record<string, string> = {
  gas: "Fuel",
  wash: "Droplets",
  service: "Wrench",
};

const partnerColors: Record<string, string> = {
  gas: "#f97316",
  wash: "#06b6d4",
  service: "#8b5cf6",
};

export default function MapView() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [radarRadius, setRadarRadius] = useState(1);
  const [userPos] = useState({ x: 50, y: 50 });
  const [bookedCar, setBookedCar] = useState<Car | null>(null);
  const [tripActive, setTripActive] = useState(false);
  const [showPartnerBonus, setShowPartnerBonus] = useState(false);
  const [chosenBonus, setChosenBonus] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  const radiusOptions = [0.5, 1, 2, 3];

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey(k => k + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const radiusPx = (radarRadius / 3) * 45;

  const handleBook = (car: Car) => {
    setBookedCar(car);
    setSelectedCar(null);
  };

  const handleStartTrip = () => {
    setTripActive(true);
    setBookedCar(null);
  };

  const handlePartnerVisit = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowPartnerBonus(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Map area */}
      <div className="relative flex-1 map-bg overflow-hidden">

        {/* Subtle city grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4 8"/>
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4 8"/>
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
          <line x1="25%" y1="0" x2="25%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
          <line x1="75%" y1="0" x2="75%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        </svg>

        {/* Parking zones */}
        {PARKING_ZONES.map(zone => (
          <div
            key={zone.id}
            className="absolute"
            style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="rounded-xl px-2 py-1 text-xs font-medium border"
              style={{
                background: zone.demand === "high" ? "rgba(34,197,94,0.12)" : "rgba(59,130,246,0.10)",
                borderColor: zone.demand === "high" ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.25)",
                color: zone.demand === "high" ? "#22c55e" : "#60a5fa",
                whiteSpace: "nowrap",
              }}
            >
              📍 {zone.label}
            </div>
          </div>
        ))}

        {/* Partner markers */}
        {PARTNERS.map(partner => (
          <div
            key={partner.id}
            className="absolute cursor-pointer"
            style={{ left: `${partner.x}%`, top: `${partner.y}%`, transform: "translate(-50%, -50%)" }}
            onClick={() => handlePartnerVisit(partner)}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              style={{ background: `${partnerColors[partner.type]}22`, border: `1.5px solid ${partnerColors[partner.type]}55` }}
            >
              <Icon name={partnerIcons[partner.type]} fallback="Star" size={16} style={{ color: partnerColors[partner.type] }} />
            </div>
          </div>
        ))}

        {/* Radar ring */}
        {!tripActive && (
          <div
            className="absolute pointer-events-none"
            style={{ left: `${userPos.x}%`, top: `${userPos.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="rounded-full border border-green-500/20"
              style={{
                width: `${radiusPx * 2}vw`,
                height: `${radiusPx * 2}vw`,
                maxWidth: `${radiusPx * 2}vmin`,
                maxHeight: `${radiusPx * 2}vmin`,
                transform: "translate(-50%, -50%)",
                position: "absolute",
              }}
            />
            {[0, 1].map((i) => (
              <div
                key={`${pulseKey}-${i}`}
                className="absolute rounded-full border border-green-500/30"
                style={{
                  width: "80px",
                  height: "80px",
                  transform: "translate(-50%, -50%)",
                  animation: `radar-ring 2s ease-out ${i * 0.7}s forwards`,
                }}
              />
            ))}
          </div>
        )}

        {/* Car markers */}
        {CARS.map(car => (
          <div
            key={car.id}
            className="absolute cursor-pointer"
            style={{ left: `${car.x}%`, top: `${car.y}%`, transform: "translate(-50%, -50%)" }}
            onClick={() => !tripActive && setSelectedCar(car)}
          >
            <div
              className="relative flex flex-col items-center"
              style={{ opacity: car.available ? 1 : 0.4 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg transition-all duration-200 hover:scale-110"
                style={{
                  background: `${classColors[car.class]}18`,
                  border: `1.5px solid ${classColors[car.class]}50`,
                  boxShadow: selectedCar?.id === car.id ? `0 0 16px ${classColors[car.class]}60` : "none",
                }}
              >
                🚗
              </div>
              <div
                className="mt-0.5 px-1.5 py-0.5 rounded text-xs font-semibold"
                style={{ background: `${classColors[car.class]}22`, color: classColors[car.class] }}
              >
                {car.plate}
              </div>
            </div>
          </div>
        ))}

        {/* User location dot */}
        <div
          className="absolute"
          style={{ left: `${userPos.x}%`, top: `${userPos.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-lg animate-glow" />
        </div>

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex gap-2">
          {tripActive ? (
            <div className="flex-1 glass rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-dot" />
              <span className="text-sm font-semibold">Поездка активна</span>
              <span className="ml-auto text-green-400 text-sm font-bold">02:14</span>
            </div>
          ) : (
            <div className="flex-1 glass rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Icon name="Search" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Куда едем?</span>
            </div>
          )}
          <div className="glass rounded-2xl w-12 h-12 flex items-center justify-center">
            <Icon name="Layers" size={18} className="text-muted-foreground" />
          </div>
        </div>

        {/* Radius selector */}
        {!tripActive && (
          <div className="absolute bottom-4 left-4 glass rounded-2xl p-1 flex gap-1">
            {radiusOptions.map(r => (
              <button
                key={r}
                onClick={() => setRadarRadius(r)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: radarRadius === r ? "var(--drive-green)" : "transparent",
                  color: radarRadius === r ? "#0f1318" : "rgba(255,255,255,0.5)",
                }}
              >
                {r < 1 ? "500м" : `${r}км`}
              </button>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 glass rounded-2xl p-3 flex flex-col gap-2">
          {Object.entries(classColors).map(([cls, color]) => (
            <div key={cls} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span className="text-xs text-muted-foreground">{classLabels[cls]}</span>
            </div>
          ))}
        </div>

        {/* Trip controls */}
        {tripActive && (
          <div className="absolute bottom-4 left-4 right-4 glass-strong rounded-2xl p-4 flex gap-3 animate-slide-up">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">Маршрут</div>
              <div className="text-sm font-semibold">ТЦ Европейский</div>
            </div>
            <button
              onClick={() => setTripActive(false)}
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: "#ef444422", color: "#f87171", border: "1px solid #ef444430" }}
            >
              Завершить
            </button>
          </div>
        )}
      </div>

      {/* Car info panel */}
      {selectedCar && (
        <div className="absolute bottom-0 left-0 right-0 glass-strong border-t border-white/10 rounded-t-3xl p-5 animate-slide-up z-10">
          <div className="w-12 h-1 bg-white/20 rounded mx-auto mb-4" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-lg"
                  style={{ background: `${classColors[selectedCar.class]}22`, color: classColors[selectedCar.class] }}
                >
                  {classLabels[selectedCar.class]}
                </span>
                <span className="text-xs text-muted-foreground">{selectedCar.transmission}</span>
              </div>
              <div className="text-xl font-bold">{selectedCar.brand} {selectedCar.model}</div>
              <div className="text-sm text-muted-foreground">{selectedCar.plate}</div>
            </div>
            <button onClick={() => setSelectedCar(null)} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">Бак</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${selectedCar.fuel}%`, background: selectedCar.fuel > 50 ? "#22c55e" : "#f59e0b" }}
                  />
                </div>
                <span className="text-sm font-bold">{selectedCar.fuel}%</span>
              </div>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-1">Запас хода</div>
              <div className="text-sm font-bold">{selectedCar.km} км</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-2xl text-sm font-semibold glass flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="Lightbulb" size={16} />
              Помигать
            </button>
            <button
              onClick={() => handleBook(selectedCar)}
              className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-105"
              style={{ background: "var(--drive-green)", color: "#0f1318" }}
            >
              <Icon name="Car" size={16} />
              Забронировать
            </button>
          </div>
        </div>
      )}

      {/* Booking confirmation */}
      {bookedCar && (
        <div className="absolute bottom-0 left-0 right-0 glass-strong border-t border-white/10 rounded-t-3xl p-5 animate-slide-up z-10">
          <div className="w-12 h-1 bg-white/20 rounded mx-auto mb-4" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "var(--drive-green-dim)" }}>
              ✅
            </div>
            <div>
              <div className="font-bold">Авто забронировано!</div>
              <div className="text-sm text-muted-foreground">{bookedCar.brand} {bookedCar.model} · {bookedCar.plate}</div>
            </div>
          </div>
          <div className="glass rounded-2xl p-3 mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Свободная отмена</span>
            <span className="text-sm font-bold text-green-400">ещё 5:00</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setBookedCar(null)}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold glass text-red-400"
            >
              Отменить
            </button>
            <button
              onClick={handleStartTrip}
              className="flex-1 py-3 rounded-2xl text-sm font-bold"
              style={{ background: "var(--drive-green)", color: "#0f1318" }}
            >
              Начать поездку
            </button>
          </div>
        </div>
      )}

      {/* Partner bonus modal */}
      {showPartnerBonus && selectedPartner && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-end">
          <div className="w-full glass-strong border-t border-white/10 rounded-t-3xl p-5 animate-slide-up">
            <div className="w-12 h-1 bg-white/20 rounded mx-auto mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${partnerColors[selectedPartner.type]}22` }}
              >
                <Icon name={partnerIcons[selectedPartner.type]} fallback="Star" size={24} style={{ color: partnerColors[selectedPartner.type] }} />
              </div>
              <div>
                <div className="font-bold">{selectedPartner.name}</div>
                <div className="text-sm" style={{ color: partnerColors[selectedPartner.type] }}>Партнёрская скидка: {selectedPartner.discount}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-4">Выберите бонус за визит:</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: "Percent", label: "-5% на эту поездку", value: "now" },
                { icon: "Clock", label: "+15 мин бесплатно", value: "next" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setChosenBonus(opt.value)}
                  className="p-3 rounded-2xl text-sm font-semibold text-left transition-all"
                  style={{
                    background: chosenBonus === opt.value ? "var(--drive-green-dim)" : "var(--drive-surface)",
                    border: chosenBonus === opt.value ? "1.5px solid var(--drive-green)" : "1px solid var(--drive-border)",
                    color: chosenBonus === opt.value ? "var(--drive-green)" : "inherit",
                  }}
                >
                  <Icon name={opt.icon} fallback="Star" size={16} className="mb-2" />
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setShowPartnerBonus(false); setChosenBonus(null); }}
              className="w-full py-3 rounded-2xl text-sm font-bold"
              style={{ background: chosenBonus ? "var(--drive-green)" : "var(--drive-surface)", color: chosenBonus ? "#0f1318" : "rgba(255,255,255,0.5)" }}
            >
              {chosenBonus ? "Применить бонус" : "Закрыть"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}