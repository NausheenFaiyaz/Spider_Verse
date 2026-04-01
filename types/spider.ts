export type SpiderHeroRecord = {
  name: string;
  earth?: string;
  universe?: string;
  fullName?: string;
  wikiUrl?: string;
  aliases?: string[];
  nicknames?: string[];
  status?: string;
  species?: string;
  gender?: string;
  affiliation?: string[];
  abilities?: string[];
  description?: string;
  imageUrl?: string;
  location?: string | null;
  occupation?: string[];
  identity?: string;
  dateOfBirth?: string | null;
  age?: string | null;
  religion?: string | null;
  ethnicity?: string | null;
  nationality?: string | null;
  skinColor?: string | null;
  eyeColor?: string | null;
  hairColor?: string | null;
  height?: string | null;
  weight?: string | null;
  voiceActor?: string | null;
  appearances?: string[];
  relatives?: string[];
  romanticInterests?: string[];
  maritalStatus?: string | null;
};

export type SpiderHero = SpiderHeroRecord & {
  id: string;
};

export type SpiderApiResponse = {
  total: number;
  characters: SpiderHeroRecord[];
};