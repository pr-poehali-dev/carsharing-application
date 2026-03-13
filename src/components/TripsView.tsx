import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Trip {
  id: number;
  date: string;
  from: string;
  to: string;
  duration: string;
  km: number;
  cost: number;
  car: string;
  status: "completed" | "cancelled";
  rating: number;
  partner?: string;
  bonusApplied?: string;
}

const TRIPS: Trip[] = [
  {
    id: 1,
    date: "Сегодня, 14:30",
    from: "ул. Арбат, 12",
    to: "ТЦ Европейский",
    duration: "24 мин",
    km: 8.4,
    cost: 312,
    car: "Toyota Camry · А234ВС77",
    status: "completed",
    rating: 5,
    partner: "Газпром Нефть",
    bonusApplied: "-5% за визит",
  },
  {
    id: 2,
    date: "Вчера, 09:15",
    from: "Аэропорт Шереметьево",
    to: "Отель Radisson",
    duration: "58 мин",
    km: 34.2,
    cost: 1840,
    car: "Mercedes E-Class · Х455УФ77",
    status: "completed",
    rating: 5,
  },
  {
    id: 3,
    date: "12 марта, 18:45",
    from: "БЦ Москва-Сити",
    to: "Кутузовский проспект",
    duration: "18 мин",
    km: 5.1,
    cost: 218,
    car: "VW Polo · К102ОП99",
    status: "completed",
    rating: 4,
    partner: "AutoSpa",
    bonusApplied: "+15 мин бесплатно",
  },
  {
    id: 4,
    date: "10 марта, 11:00",
    from: "Парк Горького",
    to: "—",
    duration: "—",
    km: 0,
    cost: 0,
    car: "Tesla Model 3 · В567ДЕ77",
    status: "cancelled",
    rating: 0,
  },
];

export default function TripsView() {
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  const completed = TRIPS.filter(t => t.status === "completed");
  const totalKm = completed.reduce((s, t) => s + t.km, 0);
  const totalCost = completed.reduce((s, t) => s + t.cost, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">Мои поездки</h1>
        <p className="text-sm text-muted-foreground">История и статистика</p>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Поездок", value: completed.length.toString(), icon: "Car" },
          { label: "Км пройдено", value: totalKm.toFixed(0), icon: "Route" },
          { label: "Потрачено", value: `${(totalCost / 1000).toFixed(1)}к`, icon: "Receipt" },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-3 text-center">
            <Icon name={stat.icon as "Car" | "Route" | "Receipt"} size={18} className="mx-auto mb-1 text-green-400" />
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Trip list */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-3">
        {TRIPS.map((trip, i) => (
          <div
            key={trip.id}
            className="glass rounded-2xl p-4 cursor-pointer transition-all hover:border-white/15 animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
            onClick={() => setActiveTrip(trip)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">{trip.date}</div>
                <div className="text-sm font-semibold">{trip.car}</div>
              </div>
              <div className="text-right">
                {trip.status === "cancelled" ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: "#ef444420", color: "#f87171" }}>
                    Отменена
                  </span>
                ) : (
                  <span className="text-base font-bold text-green-400">{trip.cost} ₽</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="w-0.5 h-8 bg-white/10 my-1" />
                <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-xs text-muted-foreground">{trip.from}</span>
                <span className="text-xs font-medium">{trip.to}</span>
              </div>
              {trip.status === "completed" && (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">{trip.duration}</span>
                  <span className="text-xs text-muted-foreground">{trip.km} км</span>
                </div>
              )}
            </div>

            {trip.partner && (
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <Icon name="Fuel" size={12} className="text-orange-400" />
                <span className="text-xs text-muted-foreground">{trip.partner}</span>
                <span className="ml-auto text-xs font-semibold text-green-400">{trip.bonusApplied}</span>
              </div>
            )}

            {trip.rating > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-xs" style={{ opacity: j < trip.rating ? 1 : 0.2 }}>⭐</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trip detail modal */}
      {activeTrip && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-end">
          <div className="w-full glass-strong border-t border-white/10 rounded-t-3xl p-5 animate-slide-up">
            <div className="w-12 h-1 bg-white/20 rounded mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-bold">{activeTrip.car}</div>
                <div className="text-sm text-muted-foreground">{activeTrip.date}</div>
              </div>
              <button onClick={() => setActiveTrip(null)}>
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="glass rounded-2xl p-4 mb-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Откуда</span>
                <span className="font-medium text-right">{activeTrip.from}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Куда</span>
                <span className="font-medium text-right">{activeTrip.to}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Время в пути</span>
                <span className="font-medium">{activeTrip.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Расстояние</span>
                <span className="font-medium">{activeTrip.km} км</span>
              </div>
              {activeTrip.partner && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Партнёр</span>
                  <span className="font-medium text-green-400">{activeTrip.bonusApplied}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-muted-foreground">Итого</span>
              <span className="text-2xl font-black text-green-400">{activeTrip.cost} ₽</span>
            </div>

            <button
              className="w-full mt-4 py-3 rounded-2xl text-sm font-semibold glass text-muted-foreground"
            >
              Повторить маршрут
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
