import type { SpiderHero } from "../types/spider";
import { fetchSpiderVerseData } from "./data/spiderVerseData";

export const getSpiderHeroes = async (): Promise<SpiderHero[]> => {
  const spiderVerseData = await fetchSpiderVerseData();
  return spiderVerseData.characters.map((character, index) => ({
    ...character,
    id: `${character.earth || character.universe || "unknown"}-${character.name}-${index}`
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-"),
  }));
};