import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
}

interface QuickReply {
  id: string;
  label: string;
  icon: string;
}

interface Scenario {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  steps: {
    message: string;
    replies?: QuickReply[];
    final?: boolean;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "accident",
    title: "ДТП",
    icon: "AlertTriangle",
    color: "#ef4444",
    description: "Попал в аварию",
    steps: [
      {
        message:
          "Понял, это срочно. Прежде всего — вы в безопасности? Есть пострадавшие?",
        replies: [
          { id: "safe_no_injured", label: "Все целы", icon: "CheckCircle" },
          { id: "injured", label: "Есть пострадавшие", icon: "HeartPulse" },
        ],
      },
      {
        message:
          "Хорошо. Выполните следующие шаги:\n\n1. Включите аварийную сигнализацию\n2. Выставьте знак аварийной остановки (15 м в городе, 30 м на трассе)\n3. Сфотографируйте место ДТП\n4. Не перемещайте автомобиль до приезда ГИБДД\n\nВызвать ГИБДД сейчас?",
        replies: [
          { id: "call_gibdd", label: "Вызвать ГИБДД", icon: "Phone" },
          { id: "euro_protocol", label: "Оформить по Европротоколу", icon: "FileText" },
        ],
      },
      {
        message:
          "Служба поддержки DRIVE уже оповещена об инциденте. Ваш случай получил номер #DRV-20240315.\n\nСтраховой агент свяжется с вами в течение 15 минут. Держите телефон доступным.\n\nЧем ещё могу помочь?",
        replies: [
          { id: "tow_truck", label: "Вызвать эвакуатор", icon: "Truck" },
          { id: "done", label: "Спасибо, всё ясно", icon: "ThumbsUp" },
        ],
        final: true,
      },
    ],
  },
  {
    id: "lost_item",
    title: "Потеря вещей",
    icon: "Package",
    color: "#f59e0b",
    description: "Забыл вещи в машине",
    steps: [
      {
        message:
          "Опишите, что вы забыли и в каком автомобиле. Укажите госномер или время последней аренды.",
        replies: [
          { id: "phone", label: "Телефон / Гаджет", icon: "Smartphone" },
          { id: "bag", label: "Сумка / Рюкзак", icon: "Briefcase" },
          { id: "docs", label: "Документы", icon: "CreditCard" },
          { id: "other_item", label: "Другое", icon: "Package" },
        ],
      },
      {
        message:
          "Понял. Ваша заявка на поиск вещей создана (#LOST-7821).\n\nПоследний пользователь этого автомобиля уже уведомлён. Наш сотрудник осмотрит салон в течение 2 часов.\n\nКуда отправить уведомление о находке?",
        replies: [
          { id: "notify_push", label: "В приложение", icon: "Bell" },
          { id: "notify_sms", label: "По SMS", icon: "MessageSquare" },
        ],
      },
      {
        message:
          "Отлично. Как только вещь будет найдена — мы сразу сообщим. Также вы можете забрать её в ближайшем офисе DRIVE.\n\nАдрес ближайшего офиса: ул. Тверская, 18 (пн-вс, 9:00–21:00)",
        final: true,
      },
    ],
  },
  {
    id: "breakdown",
    title: "Поломка",
    icon: "Wrench",
    color: "#8b5cf6",
    description: "Машина не заводится / сломалась",
    steps: [
      {
        message: "Что именно случилось с автомобилем? Опишите проблему.",
        replies: [
          { id: "wont_start", label: "Не заводится", icon: "KeyRound" },
          { id: "flat_tire", label: "Пробило колесо", icon: "CircleDot" },
          { id: "locked_out", label: "Не могу открыть", icon: "Lock" },
          { id: "other_break", label: "Другая неисправность", icon: "Wrench" },
        ],
      },
      {
        message:
          "Понял ситуацию. Ваше местоположение определено. Технический специалист DRIVE уже направлен к вам.\n\nОжидаемое время прибытия: **18–25 минут**\n\nПока ждёте — оставайтесь у машины, не покидайте место. Хотите отслеживать прибытие мастера?",
        replies: [
          { id: "track_tech", label: "Отслеживать мастера", icon: "Navigation" },
          { id: "tow_instead", label: "Лучше эвакуатор", icon: "Truck" },
        ],
      },
      {
        message:
          "Трекинг мастера активирован. Уведомление придёт за 3 минуты до прибытия.\n\nПока ждёте, не пытайтесь заводить автомобиль повторно — это может ухудшить ситуацию.\n\nНомер заявки: #TECH-4492. Сохраните его для отчёта.",
        final: true,
      },
    ],
  },
  {
    id: "road_situation",
    title: "Сложная дорога",
    icon: "MapPin",
    color: "#06b6d4",
    description: "Сложная ситуация на дороге",
    steps: [
      {
        message:
          "Расскажите, что происходит. Я помогу разобраться с ситуацией на дороге.",
        replies: [
          { id: "stuck", label: "Застрял (снег/грязь)", icon: "Mountain" },
          { id: "wrong_zone", label: "Выехал за зону", icon: "MapPin" },
          { id: "parking", label: "Проблема с парковкой", icon: "ParkingSquare" },
          { id: "aggression", label: "Агрессивный водитель", icon: "ShieldAlert" },
        ],
      },
      {
        message:
          "Понял, ситуация зафиксирована.\n\nЕсли вам угрожает опасность — немедленно позвоните 112.\n\nДля помощи с застреванием: технический эвакуатор прибудет через 20–35 минут. Геолокация автомобиля передана диспетчеру.\n\nЧто сделать прямо сейчас?",
        replies: [
          { id: "send_geo", label: "Отправить геолокацию", icon: "Navigation" },
          { id: "call_support", label: "Позвонить в поддержку", icon: "Phone" },
        ],
      },
      {
        message:
          "Геолокация передана. Диспетчер видит вас на карте в реальном времени.\n\nПоддержка DRIVE на связи. Время реакции — менее 2 минут.\n\nЕсли ситуация ухудшится — нажмите кнопку SOS в верхней части экрана.",
        final: true,
      },
    ],
  },
  {
    id: "billing",
    title: "Оплата",
    icon: "CreditCard",
    color: "#22c55e",
    description: "Вопросы по оплате",
    steps: [
      {
        message: "Что вас беспокоит по поводу оплаты?",
        replies: [
          { id: "double_charge", label: "Списали дважды", icon: "AlertCircle" },
          { id: "wrong_amount", label: "Неверная сумма", icon: "Calculator" },
          { id: "refund", label: "Вернуть деньги", icon: "RotateCcw" },
          { id: "receipt", label: "Нужен чек", icon: "Receipt" },
        ],
      },
      {
        message:
          "Запрос принят. Наш финансовый отдел проверит все транзакции по вашему аккаунту за последние 30 дней.\n\nСроки рассмотрения: **1–3 рабочих дня**\n\nОтчёт придёт на почту, привязанную к аккаунту DRIVE.",
        replies: [
          { id: "urgent_billing", label: "Это срочно", icon: "Zap" },
          { id: "ok_billing", label: "Хорошо, жду", icon: "CheckCircle" },
        ],
      },
      {
        message:
          "Заявка №FIN-2891 создана с приоритетом. Агент свяжется с вами в течение 4 часов.\n\nВ ожидании — вы можете проверить историю транзакций в разделе «Профиль → Платежи».",
        final: true,
      },
    ],
  },
];

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "bot",
  text: "Привет! Я Юра, ваш помощник DRIVE. Помогу в любой ситуации — от ДТП до вопросов по оплате. Выберите тему или напишите сообщение:",
  time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
};

const SCENARIO_CARDS: QuickReply[] = SCENARIOS.map((s) => ({
  id: s.id,
  label: s.title,
  icon: s.icon,
}));

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--drive-green-dim)", border: "1px solid var(--drive-green-glow)" }}
      >
        <span className="text-xs" style={{ color: "var(--drive-green)" }}>Ю</span>
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--drive-green)",
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [phase, setPhase] = useState<"menu" | "scenario" | "free">("menu");
  const [isFinalStep, setIsFinalStep] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const now = () =>
    new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });

  const addBotMessage = (text: string, delay = 1200, onDone?: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "bot", text, time: now() },
      ]);
      onDone?.();
    }, delay);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text, time: now() },
    ]);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    addUserMessage(scenario.description);
    setCurrentScenario(scenario);
    setStepIndex(0);
    setPhase("scenario");
    setIsFinalStep(false);
    addBotMessage(scenario.steps[0].message);
  };

  const handleQuickReply = (reply: QuickReply) => {
    if (phase === "menu") {
      handleScenarioSelect(reply.id);
      return;
    }

    if (reply.id === "done" || isFinalStep) {
      addUserMessage(reply.label);
      addBotMessage(
        "Рад помочь! Если возникнут ещё вопросы — я всегда здесь. Берегите себя на дорогах! 🚗",
        800,
        () => {
          setCurrentScenario(null);
          setStepIndex(0);
          setPhase("menu");
          setIsFinalStep(false);
        }
      );
      return;
    }

    if (currentScenario) {
      const nextStep = currentScenario.steps[stepIndex + 1];
      if (nextStep) {
        addUserMessage(reply.label);
        setStepIndex((i) => i + 1);
        const isFinal = !!nextStep.final;
        addBotMessage(nextStep.message, 1200, () => {
          if (isFinal) setIsFinalStep(true);
        });
      }
    }
  };

  const handleSendText = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    addUserMessage(text);

    if (phase === "menu" || phase === "free") {
      setPhase("free");
      const lower = text.toLowerCase();
      if (lower.includes("дтп") || lower.includes("авари") || lower.includes("удар")) {
        handleScenarioSelect("accident");
        return;
      }
      if (lower.includes("вещ") || lower.includes("забыл") || lower.includes("потер")) {
        handleScenarioSelect("lost_item");
        return;
      }
      if (lower.includes("слома") || lower.includes("не завод") || lower.includes("поломк")) {
        handleScenarioSelect("breakdown");
        return;
      }
      if (lower.includes("оплат") || lower.includes("списал") || lower.includes("деньг")) {
        handleScenarioSelect("billing");
        return;
      }
      addBotMessage(
        "Понял ваш запрос. Уточните ситуацию или выберите тему ниже — помогу разобраться быстрее.",
        900,
        () => setPhase("menu")
      );
    }
  };

  const currentReplies: QuickReply[] =
    phase === "menu"
      ? SCENARIO_CARDS
      : currentScenario && !isTyping
      ? isFinalStep
        ? [{ id: "done", label: "Спасибо, всё ясно", icon: "ThumbsUp" }]
        : currentScenario.steps[stepIndex]?.replies ?? []
      : [];

  const getScenarioColor = (id: string) =>
    SCENARIOS.find((s) => s.id === id)?.color ?? "var(--drive-green)";

  return (
    <div className="flex flex-col h-full" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 pt-2 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center relative"
            style={{ background: "var(--drive-green-dim)", border: "1px solid var(--drive-green-glow)" }}
          >
            <span className="font-bold text-sm" style={{ color: "var(--drive-green)", fontFamily: "Montserrat, sans-serif" }}>Ю</span>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{
                background: "#22c55e",
                borderColor: "hsl(var(--background))",
              }}
            />
          </div>
          <div>
            <div className="font-semibold text-sm">Юра — помощник DRIVE</div>
            <div className="text-xs flex items-center gap-1" style={{ color: "var(--drive-green)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              На связи 24/7
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <Icon name="Phone" size={16} style={{ color: "var(--drive-green)" }} />
            </button>
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <Icon name="MoreVertical" size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
            </button>
          </div>
        </div>
      </div>

      {/* SOS Banner */}
      <div
        className="flex-shrink-0 mx-4 mt-3 px-4 py-2.5 rounded-2xl flex items-center gap-3"
        style={{
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
        }}
      >
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(239,68,68,0.15)" }}>
          <Icon name="Siren" fallback="AlertTriangle" size={14} style={{ color: "#ef4444" }} />
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: "#ef4444" }}>SOS — Экстренная помощь</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Удерживайте 2 сек. при опасности</div>
        </div>
        <button
          className="ml-auto px-3 py-1 rounded-xl text-xs font-bold"
          style={{ background: "#ef4444", color: "#fff" }}
        >
          112
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={{ scrollbarWidth: "none" }}>
        {messages.map((msg, idx) => {
          const isBot = msg.role === "bot";
          const isFirst = idx === 0 || messages[idx - 1].role !== msg.role;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 mb-2 ${isBot ? "" : "flex-row-reverse"}`}
              style={{ animation: "fadeInUp 0.25s ease both" }}
            >
              {isBot && isFirst ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                  style={{ background: "var(--drive-green-dim)", border: "1px solid var(--drive-green-glow)" }}
                >
                  <span className="text-xs font-bold" style={{ color: "var(--drive-green)" }}>Ю</span>
                </div>
              ) : isBot ? (
                <div className="w-8 flex-shrink-0" />
              ) : null}

              <div style={{ maxWidth: "76%" }}>
                <div
                  className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    isBot ? "rounded-2xl rounded-bl-sm" : "rounded-2xl rounded-br-sm"
                  }`}
                  style={
                    isBot
                      ? {
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.9)",
                        }
                      : {
                          background: "var(--drive-green)",
                          color: "#0a1a0f",
                          fontWeight: 500,
                        }
                  }
                >
                  {msg.text}
                </div>
                <div
                  className={`text-xs mt-1 ${isBot ? "text-left pl-1" : "text-right pr-1"}`}
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {currentReplies.length > 0 && !isTyping && (
        <div
          className="flex-shrink-0 px-4 pb-3"
          style={{ animation: "fadeInUp 0.3s ease both" }}
        >
          {phase === "menu" ? (
            <div className="grid grid-cols-3 gap-2">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: `${scenario.color}11`,
                    border: `1px solid ${scenario.color}33`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${scenario.color}22` }}
                  >
                    <Icon name={scenario.icon} fallback="HelpCircle" size={18} style={{ color: scenario.color }} />
                  </div>
                  <span className="text-xs font-semibold leading-tight" style={{ color: scenario.color }}>
                    {scenario.title}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentReplies.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <Icon name={reply.icon} fallback="MessageCircle" size={14} style={{ color: "var(--drive-green)" }} />
                  {reply.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div
        className="flex-shrink-0 px-4 pb-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <input
            type="text"
            placeholder="Напишите ситуацию..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            className="flex-1 bg-transparent text-sm outline-none placeholder-opacity-40"
            style={{ color: "rgba(255,255,255,0.85)" }}
          />
          <button
            onClick={handleSendText}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95"
            style={{
              background: inputText.trim() ? "var(--drive-green)" : "rgba(255,255,255,0.08)",
            }}
          >
            <Icon
              name="Send"
              size={14}
              style={{ color: inputText.trim() ? "#0a1a0f" : "rgba(255,255,255,0.3)" }}
            />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Защищено · DRIVE Support v2.0
          </span>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
