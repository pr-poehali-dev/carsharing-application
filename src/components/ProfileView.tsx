import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Achievement {
  icon: string;
  label: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { icon: "⛽", label: "Первая заправка у партнёра", unlocked: true },
  { icon: "🧼", label: "Мойка у партнёра", unlocked: true },
  { icon: "🏆", label: "100 поездок", unlocked: false },
  { icon: "🌿", label: "Эко-водитель", unlocked: false },
  { icon: "⭐", label: "Рейтинг 5.0", unlocked: true },
  { icon: "🚀", label: "Первая бизнес-поездка", unlocked: true },
];

export default function ProfileView() {
  const [notif, setNotif] = useState(true);
  const [locationShare, setLocationShare] = useState(true);

  const rating = 4.8;
  const ratingMax = 5;
  const ratingPercent = (rating / ratingMax) * 100;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">Профиль</h1>
        <p className="text-sm text-muted-foreground">Личный кабинет водителя</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {/* User card */}
        <div className="glass rounded-3xl p-5 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: "var(--drive-green-dim)", border: "1.5px solid var(--drive-green-glow)" }}
            >
              АС
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">Алексей Смирнов</div>
              <div className="text-sm text-muted-foreground">+7 (999) 123-45-67</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: "var(--drive-green-dim)", color: "var(--drive-green)" }}>
                  Стандарт
                </span>
                <span className="text-xs text-muted-foreground">с апреля 2024</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Рейтинг водителя</span>
              <span className="text-lg font-black text-green-400">{rating}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${ratingPercent}%`, background: "linear-gradient(90deg, #22c55e, #4ade80)" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
            {[
              { label: "Поездок", value: "47" },
              { label: "Баллов", value: "1 240" },
              { label: "Сэкономлено", value: "890 ₽" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-base font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty card */}
        <div
          className="rounded-3xl p-5 animate-fade-in delay-100"
          style={{
            background: "linear-gradient(135deg, #1a2f1e 0%, #0f2218 100%)",
            border: "1.5px solid rgba(34,197,94,0.25)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-green-400/70 font-semibold uppercase tracking-wider">Программа лояльности</div>
              <div className="text-lg font-bold mt-0.5">DRIVE Rewards</div>
            </div>
            <div className="text-3xl">🏅</div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-black text-green-400">1 240</div>
              <div className="text-xs text-muted-foreground">баллов накоплено</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">До Gold: 760</div>
              <div className="text-xs text-muted-foreground">баллов</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full" style={{ width: "62%", background: "linear-gradient(90deg, #22c55e, #4ade80)" }} />
          </div>
        </div>

        {/* Partners section */}
        <div className="animate-fade-in delay-200">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Партнёры</div>
          <div className="space-y-2">
            {[
              { icon: "⛽", name: "Газпром Нефть", desc: "Скидка 90% на топливо", visits: 8, color: "#f97316" },
              { icon: "🧼", name: "AutoSpa", desc: "Бесплатная мойка", visits: 3, color: "#06b6d4" },
              { icon: "🔧", name: "КЛЮЧАВТО СТО", desc: "ТО со скидкой 50%", visits: 1, color: "#8b5cf6" },
            ].map(p => (
              <div key={p.name} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${p.color}18` }}
                >
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{p.visits}</div>
                  <div className="text-xs text-muted-foreground">визитов</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="animate-fade-in delay-300">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Достижения</div>
          <div className="grid grid-cols-3 gap-2">
            {ACHIEVEMENTS.map(a => (
              <div
                key={a.label}
                className="glass rounded-2xl p-3 text-center"
                style={{ opacity: a.unlocked ? 1 : 0.35 }}
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-xs text-muted-foreground leading-tight">{a.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="animate-fade-in delay-400">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Настройки</div>
          <div className="glass rounded-2xl divide-y divide-white/5">
            {[
              { icon: "Bell", label: "Уведомления", toggle: true, value: notif, onChange: setNotif },
              { icon: "MapPin", label: "Геопозиция", toggle: true, value: locationShare, onChange: setLocationShare },
            ].map(s => (
              <div key={s.label} className="px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name={s.icon as "Bell" | "MapPin"} size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                <div
                  className="w-10 h-6 rounded-full transition-all duration-300 relative cursor-pointer"
                  style={{ background: s.value ? "var(--drive-green)" : "rgba(255,255,255,0.12)" }}
                  onClick={() => s.onChange(!s.value)}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                    style={{ left: s.value ? "calc(100% - 20px)" : "4px" }}
                  />
                </div>
              </div>
            ))}
            {[
              { icon: "CreditCard", label: "Способы оплаты" },
              { icon: "Shield", label: "Безопасность" },
              { icon: "HelpCircle", label: "Поддержка" },
            ].map(s => (
              <div key={s.label} className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon name={s.icon as "CreditCard" | "Shield" | "HelpCircle"} size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
