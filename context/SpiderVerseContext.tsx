import React, { createContext, useContext, useMemo, useState } from "react";

import type { SpiderHero } from "../types/spider";

type SpiderVerseContextValue = {
  savedHeroes: SpiderHero[];
  isSaved: (heroId: string) => boolean;
  toggleSavedHero: (hero: SpiderHero) => void;
};

const SpiderVerseContext = createContext<SpiderVerseContextValue | undefined>(
  undefined,
);

export function SpiderVerseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedHeroes, setSavedHeroes] = useState<SpiderHero[]>([]);

  const value = useMemo<SpiderVerseContextValue>(() => {
    const isSaved = (heroId: string) =>
      savedHeroes.some((savedHero) => savedHero.id === heroId);

    const toggleSavedHero = (hero: SpiderHero) => {
      setSavedHeroes((current) => {
        const exists = current.some((savedHero) => savedHero.id === hero.id);

        if (exists) {
          return current.filter((savedHero) => savedHero.id !== hero.id);
        }

        return [hero, ...current];
      });
    };

    return {
      savedHeroes,
      isSaved,
      toggleSavedHero,
    };
  }, [savedHeroes]);

  return (
    <SpiderVerseContext.Provider value={value}>
      {children}
    </SpiderVerseContext.Provider>
  );
}

export function useSpiderVerse() {
  const context = useContext(SpiderVerseContext);

  if (!context) {
    throw new Error("useSpiderVerse must be used within SpiderVerseProvider");
  }

  return context;
}
