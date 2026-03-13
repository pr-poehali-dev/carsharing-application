import { useState } from "react";
import Icon from "@/components/ui/icon";

type TabType = "online" | "delivery";

interface FilterState {
  bodyType: string;
  carClass: string;
  transmission: string;
  childSeat: boolean;
  fullTank: boolean;
  bluetooth: boolean;
}

const BODY_TYPES = ["Любой", "Седан", "Хэтчбек", "Кроссовер", "Минивен"];
const CAR_CLASSES = ["Любой", "Эко", "Комфорт", "Бизнес"];
const TRANSMISSIONS = ["Любая", "AT", "MT", "CVT"];

export default function BookingView() {
  const [tab, setTab] = useState<TabType>("online");
  const [filters, setFilters] = useState<FilterState>({
    bodyType: "Любой",
    carClass: "Любой",
    transmission: "Любая",
    childSeat: false,
    fullTank: false,
    bluetooth: false,
  });

  const [deliveryForm, setDeliveryForm] = useState({
    date: "",
    time: "",
    address: "",
    tariff: "comfort",
    payment: "card",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleDeliveryOrder = () => setOrderPlaced(true);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">Бронирование</h1>
        <p className="text-sm text-muted-foreground">Выберите способ получения авто</p>
      </div>

      {/* Tab switcher */}
      <div className="px-5 mb-5">
        <div className="glass rounded-2xl p-1 flex">
          {[
            { id: "online" as TabType, label: "Онлайн", icon: "Wifi" },
            { id: "delivery" as TabType, label: "С доставкой", icon: "Truck" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: tab === t.id ? "var(--drive-green)" : "transparent",
                color: tab === t.id ? "#0f1318" : "rgba(255,255,255,0.5)",
              }}
            >
              <Icon name={t.icon as "Wifi" | "Truck"} size={15} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {tab === "online" ? (
          <div className="animate-fade-in space-y-4">
            {/* Filters section */}
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Фильтры</div>

            {/* Body type */}
            <div>
              <div className="text-sm font-medium mb-2">Тип кузова</div>
              <div className="flex gap-2 flex-wrap">
                {BODY_TYPES.map(bt => (
                  <button
                    key={bt}
                    onClick={() => setFilters(f => ({ ...f, bodyType: bt }))}
                    className="px-3 py-1.5 rounded-xl text-sm transition-all"
                    style={{
                      background: filters.bodyType === bt ? "var(--drive-green)" : "var(--drive-surface)",
                      color: filters.bodyType === bt ? "#0f1318" : "rgba(255,255,255,0.7)",
                      border: filters.bodyType === bt ? "none" : "1px solid var(--drive-border)",
                      fontWeight: filters.bodyType === bt ? 600 : 400,
                    }}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            {/* Class */}
            <div>
              <div className="text-sm font-medium mb-2">Класс авто</div>
              <div className="flex gap-2">
                {CAR_CLASSES.map((cls, i) => {
                  const colors = ["#ffffff30", "#22c55e", "#3b82f6", "#f59e0b"];
                  const active = filters.carClass === cls;
                  return (
                    <button
                      key={cls}
                      onClick={() => setFilters(f => ({ ...f, carClass: cls }))}
                      className="px-3 py-1.5 rounded-xl text-sm transition-all"
                      style={{
                        background: active ? `${colors[i]}30` : "var(--drive-surface)",
                        color: active ? colors[i] : "rgba(255,255,255,0.7)",
                        border: active ? `1px solid ${colors[i]}60` : "1px solid var(--drive-border)",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <div className="text-sm font-medium mb-2">Коробка передач</div>
              <div className="flex gap-2">
                {TRANSMISSIONS.map(tr => (
                  <button
                    key={tr}
                    onClick={() => setFilters(f => ({ ...f, transmission: tr }))}
                    className="px-3 py-1.5 rounded-xl text-sm transition-all"
                    style={{
                      background: filters.transmission === tr ? "var(--drive-green)" : "var(--drive-surface)",
                      color: filters.transmission === tr ? "#0f1318" : "rgba(255,255,255,0.7)",
                      border: filters.transmission === tr ? "none" : "1px solid var(--drive-border)",
                      fontWeight: filters.transmission === tr ? 600 : 400,
                    }}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle options */}
            <div className="space-y-3">
              {[
                { key: "childSeat" as keyof FilterState, label: "Детское кресло", icon: "Baby" },
                { key: "fullTank" as keyof FilterState, label: "Полный бак", icon: "Fuel" },
                { key: "bluetooth" as keyof FilterState, label: "Bluetooth двери", icon: "Bluetooth" },
              ].map(opt => (
                <div
                  key={opt.key}
                  className="glass rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer"
                  onClick={() => setFilters(f => ({ ...f, [opt.key]: !f[opt.key] }))}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={opt.icon as "Baby" | "Fuel" | "Bluetooth"} size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </div>
                  <div
                    className="w-10 h-6 rounded-full transition-all duration-300 relative"
                    style={{ background: filters[opt.key] ? "var(--drive-green)" : "rgba(255,255,255,0.12)" }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                      style={{ left: filters[opt.key] ? "calc(100% - 20px)" : "4px" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full py-4 rounded-2xl text-sm font-bold mt-2 flex items-center justify-center gap-2"
              style={{ background: "var(--drive-green)", color: "#0f1318" }}
            >
              <Icon name="Search" size={16} />
              Найти авто на карте
            </button>
          </div>
        ) : (
          <div className="animate-fade-in space-y-4">
            {orderPlaced ? (
              <div className="text-center py-12 animate-scale-in">
                <div className="text-5xl mb-4">🚗</div>
                <div className="text-xl font-bold mb-2">Заказ принят!</div>
                <div className="text-muted-foreground text-sm mb-6">
                  Авто прибудет за 20 минут до указанного времени.<br/>
                  Чистое и заправленное — ждите оповещение.
                </div>
                <div className="glass rounded-2xl p-4 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Адрес</span>
                    <span className="font-medium">{deliveryForm.address || "ул. Ленина, 15"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Время</span>
                    <span className="font-medium">{deliveryForm.time || "10:00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Подача</span>
                    <span className="font-bold text-green-400">99 ₽</span>
                  </div>
                </div>
                <button
                  onClick={() => setOrderPlaced(false)}
                  className="mt-4 text-sm text-muted-foreground underline"
                >
                  Отменить заказ
                </button>
              </div>
            ) : (
              <>
                {/* Tariff */}
                <div>
                  <div className="text-sm font-medium mb-2">Тариф</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "eco", label: "Эко", price: "от 3₽/мин", color: "#22c55e" },
                      { id: "comfort", label: "Комфорт", price: "от 6₽/мин", color: "#3b82f6" },
                      { id: "business", label: "Бизнес", price: "от 12₽/мин", color: "#f59e0b" },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setDeliveryForm(f => ({ ...f, tariff: t.id }))}
                        className="p-3 rounded-2xl text-left transition-all"
                        style={{
                          background: deliveryForm.tariff === t.id ? `${t.color}18` : "var(--drive-surface)",
                          border: deliveryForm.tariff === t.id ? `1.5px solid ${t.color}60` : "1px solid var(--drive-border)",
                        }}
                      >
                        <div className="text-sm font-bold mb-1" style={{ color: deliveryForm.tariff === t.id ? t.color : "inherit" }}>
                          {t.label}
                        </div>
                        <div className="text-xs text-muted-foreground">{t.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm font-medium mb-2">Дата</div>
                    <input
                      type="date"
                      className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none"
                      style={{ background: "var(--drive-surface)", border: "1px solid var(--drive-border)", colorScheme: "dark" }}
                      value={deliveryForm.date}
                      onChange={e => setDeliveryForm(f => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Время</div>
                    <input
                      type="time"
                      className="w-full glass rounded-2xl px-4 py-3 text-sm outline-none"
                      style={{ background: "var(--drive-surface)", border: "1px solid var(--drive-border)", colorScheme: "dark" }}
                      value={deliveryForm.time}
                      onChange={e => setDeliveryForm(f => ({ ...f, time: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div className="text-sm font-medium mb-2">Адрес подачи</div>
                  <div className="relative">
                    <Icon name="MapPin" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Введите адрес..."
                      className="w-full rounded-2xl px-4 pl-10 py-3 text-sm outline-none"
                      style={{ background: "var(--drive-surface)", border: "1px solid var(--drive-border)" }}
                      value={deliveryForm.address}
                      onChange={e => setDeliveryForm(f => ({ ...f, address: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <div className="text-sm font-medium mb-2">Оплата</div>
                  <div className="flex gap-2">
                    {[
                      { id: "card", label: "Карта", icon: "CreditCard" },
                      { id: "sbp", label: "СБП", icon: "Smartphone" },
                      { id: "balance", label: "Баланс", icon: "Wallet" },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setDeliveryForm(f => ({ ...f, payment: p.id }))}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all"
                        style={{
                          background: deliveryForm.payment === p.id ? "var(--drive-green)" : "var(--drive-surface)",
                          color: deliveryForm.payment === p.id ? "#0f1318" : "rgba(255,255,255,0.7)",
                          border: deliveryForm.payment === p.id ? "none" : "1px solid var(--drive-border)",
                        }}
                      >
                        <Icon name={p.icon as "CreditCard" | "Smartphone" | "Wallet"} size={16} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery price banner */}
                <div className="glass rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">Стоимость подачи</div>
                    <div className="text-xs text-muted-foreground">Чистое, заправленное, вовремя</div>
                  </div>
                  <div className="text-2xl font-black text-green-400">99 ₽</div>
                </div>

                <button
                  onClick={handleDeliveryOrder}
                  className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: "var(--drive-green)", color: "#0f1318" }}
                >
                  <Icon name="Truck" size={16} />
                  Заказать доставку
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
