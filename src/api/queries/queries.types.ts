export interface AlQuranResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface JuzMeta {
  surah: string;
  ayah: string;
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction?: string;
}

export interface Ayah {
  number: number;
  text: string;
  surah: Surah;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda:
    | boolean
    | {
        id: number;
        recommended: boolean;
        obligatory: boolean;
      };
}

export interface JuzData {
  number: number;
  ayahs: Ayah[];
  surahs: Record<string, Surah>;
  edition: Edition;
}

export interface JuzResponse {
  code: number;
  status: string;
  data: JuzData;
}

export interface MetaResponse {
  juzs: {
    references: JuzMeta[];
  };
}
