"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/marketing-content";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };

const Ctx = React.createContext<LangCtx>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("mystorr-lang") : null;
    if (saved === "hi" || saved === "en") setLangState(saved);
  }, []);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("mystorr-lang", l);
    } catch {
      /* ignore */
    }
  }, []);

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return React.useContext(Ctx);
}

// Small "EN | हिं" pill toggle for the navbar.
export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-white/70 p-0.5 text-xs font-bold backdrop-blur",
        className
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          lang === "en" ? "bg-brand text-white" : "text-muted hover:text-ink"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        aria-pressed={lang === "hi"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          lang === "hi" ? "bg-brand text-white" : "text-muted hover:text-ink"
        )}
      >
        हिं
      </button>
    </div>
  );
}
