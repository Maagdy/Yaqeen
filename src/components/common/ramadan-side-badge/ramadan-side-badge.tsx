import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks";
import { formatNumber } from "@/utils/numbers";
import {
  getRamadanStatus,
  getDaysRemainingInRamadan,
  getDaysUntilRamadan,
  getCurrentRamadanDay,
} from "@/utils/ramadan-dates";

export const RamadanSideBadge = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const isRTL = i18n.language === "ar";

  const [ramadanStatus, setRamadanStatus] = useState(getRamadanStatus());
  const [daysCount, setDaysCount] = useState(() => {
    const status = getRamadanStatus();
    if (status.status === "during") return getDaysRemainingInRamadan();
    if (status.status === "before") return getDaysUntilRamadan();
    return 0;
  });
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const updateRamadanData = () => {
      const status = getRamadanStatus();
      setRamadanStatus(status);

      if (status.status === "during") {
        setDaysCount(getDaysRemainingInRamadan());
      } else if (status.status === "before") {
        setDaysCount(getDaysUntilRamadan());
      } else {
        setDaysCount(0);
      }
    };

    const interval = setInterval(updateRamadanData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      <div
        className={`
          fixed ${isRTL ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 z-50
          flex items-stretch
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${expanded ? "translate-x-0" : isRTL ? "translate-x-[calc(-100%+2.75rem)]" : "translate-x-[calc(100%-2.75rem)]"}
        `}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <button
          onClick={() => setExpanded((p) => !p)}
          className={`
            relative flex flex-col items-center justify-center
            w-11 ${isRTL ? "rounded-r-2xl border-r border-t border-b shadow-[4px_0_20px_rgba(251,191,36,0.4)]" : "rounded-l-2xl border-l border-t border-b shadow-[-4px_0_20px_rgba(251,191,36,0.4)]"}
            bg-linear-to-b from-amber-500 via-yellow-400 to-amber-500
            border-amber-300/40
            cursor-pointer select-none
            py-6 gap-2
            hover:from-amber-400 hover:to-amber-400
            transition-colors duration-200
          `}
          aria-label={t("ramadan.sideBadge.toggle")}
        >
          <span
            className="
              text-[10px] font-bold tracking-[0.25em] uppercase
              text-amber-900
              writing-mode-vertical
            "
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {isRTL ? "رمضان" : "RAMADAN"}
          </span>

          <span className="text-amber-900 text-base leading-none">🌙</span>

          <span
            className={`text-amber-900 text-xs transition-transform duration-300 ${
              expanded
                ? isRTL
                  ? "rotate-180"
                  : "rotate-0"
                : isRTL
                  ? "rotate-0"
                  : "rotate-180"
            }`}
          >
            {isRTL ? "‹" : "›"}
          </span>
        </button>

        <div
          className={`
            relative flex flex-col justify-between
            w-56 ${isRTL ? " shadow-[8px_0_40px_rgba(0,0,0,0.25)]" : "shadow-[-8px_0_40px_rgba(0,0,0,0.25)]"}
            overflow-hidden
          `}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-linear(160deg, #0f172a 0%, #1e1a4f 50%, #0f172a 100%)",
            }}
          />

          {[
            { top: "8%", left: "15%", size: 2 },
            { top: "20%", left: "70%", size: 1.5 },
            { top: "35%", left: "40%", size: 1 },
            { top: "55%", left: "80%", size: 2 },
            { top: "70%", left: "25%", size: 1.5 },
            { top: "85%", left: "60%", size: 1 },
            { top: "15%", left: "50%", size: 1 },
            { top: "90%", left: "10%", size: 2 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${2 + i * 0.3}s`,
              }}
            />
          ))}

          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
            style={{
              background: "radial-linear(circle, #fbbf24 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col h-full p-4 gap-4 bg-ramadan">
            <button
              onClick={() => setVisible(false)}
              className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} text-white/40 hover:text-white/80 text-xs transition-colors`}
              aria-label={t("ramadan.sideBadge.dismiss")}
            >
              ✕
            </button>

            <div className="text-center pt-2">
              <p
                className="text-amber-300 text-xl font-bold leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {isRTL
                  ? t("ramadan.sideBadge.ramadanKareem")
                  : t("ramadan.sideBadge.ramadanKareem")}
              </p>
              <p className="text-white/50 text-[10px] tracking-widest uppercase mt-0.5">
                {isRTL ? "Ramadan Kareem" : "رمضان كريم"}
              </p>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />

            <div className="text-center">
              <div
                className="
                  inline-flex flex-col items-center
                  bg-white/5 border border-amber-400/20
                  rounded-xl px-4 py-3 w-full
                "
              >
                <span
                  className="text-4xl font-black text-amber-300 leading-none"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatNumber(daysCount, language)}
                </span>
                <span className="text-white/60 text-[10px] tracking-widest uppercase mt-1">
                  {ramadanStatus.status === "during"
                    ? t("ramadan.sideBadge.daysRemaining")
                    : ramadanStatus.status === "before"
                      ? t("ramadan.sideBadge.daysUntil")
                      : t("ramadan.sideBadge.ramadanEnded")}
                </span>
                {ramadanStatus.status === "during" && (
                  <span className="text-white/40 text-[9px] mt-0.5">
                    {t("ramadan.sideBadge.dayOf", {
                      day: getCurrentRamadanDay(),
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-white/80 text-xs leading-relaxed">
                🏆{" "}
                {isRTL
                  ? t("ramadan.sideBadge.challengesAr")
                  : t("ramadan.sideBadge.challenges")}
              </p>
              <p className="text-white/50 text-[10px] mt-0.5">
                {t("ramadan.sideBadge.dailyChallenges")}
              </p>
            </div>

            <button
              onClick={() => {
                setExpanded(false);
                setTimeout(() => navigate("/ramadan"), 300);
              }}
              className="
                w-full py-2.5 rounded-xl
                bg-linear-to-r from-amber-500 to-yellow-400
                text-amber-900 font-bold text-xs tracking-wide
                shadow-[0_4px_15px_rgba(251,191,36,0.35)]
                hover:shadow-[0_4px_25px_rgba(251,191,36,0.55)]
                hover:from-amber-400 hover:to-yellow-300
                transition-all duration-200
                active:scale-95
              "
            >
              {t("ramadan.sideBadge.startChallenges")} ✨
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
