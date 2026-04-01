import type { SpiderApiResponse } from "../../types/spider";

const api_url = "https://spiderdex.hogyoku.cloud/api";

export const fetchSpiderVerseData = async (): Promise<SpiderApiResponse> => {
  const response = await fetch(`${api_url}/characters`);
  if (!response.ok) {
    throw new Error("Failed to fetch SpiderVerse data");
  }
  const data: SpiderApiResponse = await response.json();
  return data;
};