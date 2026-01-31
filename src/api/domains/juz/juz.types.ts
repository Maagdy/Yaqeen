import type { Ayah, Edition, Surah } from "../chapter";

export interface AlQuranResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface JuzMeta {
  surah: string;
  ayah: string;
}

export interface JuzData {
  number: number;
  ayahs: Ayah[];
  surahs: Record<string, Surah>;
  edition: Edition;
}
export interface MetaResponse {
  juzs: {
    references: JuzMeta[];
  };
}
