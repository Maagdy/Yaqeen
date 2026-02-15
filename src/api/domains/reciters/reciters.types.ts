export interface Moshaf {
  id: number;
  name: string;
  server: string;
  surah_total: number;
  moshaf_type: number;
  surah_list: string; // comma-separated numbers
}

export interface Reciter {
  id: number;
  name: string;
  englishName?: string;
  letter: string;
  date: string;
  moshaf: Moshaf[];
}

export interface RecitersResponse {
  reciters: Reciter[];
}

export interface GetRecitersParams {
  language?: string;
  rewaya?: number;
  sura?: number;
  reciter?: number;
  [key: string]: string | number | undefined;
}
