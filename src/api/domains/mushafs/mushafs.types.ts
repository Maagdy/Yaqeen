/* =========================
   Root
========================= */

export type FullMushaf = {
  id: number;
  name: string;
  description: string;
  image: string;
  bismillah: string;
  font_file: string;
  images: string;
  images_png: string;
  rawi: Rawi;
};

export type FullMushafWithSurahs = {
  id: number;
  name: string;
  description: string;
  image: string;

  bismillah?: string;
  font_file?: string | null;

  images?: string; // svg zip

  surahs: MushafSurah[];

  rawi: Rawi;
};

/* =========================
   Surah
========================= */

export type MushafSurah = {
  id: number;
  name: string;
  coded_name: string;
  ayahs: MushafAyah[];
};

/* =========================
   Ayah
========================= */

export type MushafAyah = {
  id: number;

  number: number; // ayah number inside surah
  surah: string; // API sends string ("114")

  page_number: number;
  text: string;
  marker: string;

  juz: number;
  hizb: number;
  ruku: number;
  manzil: number;

  options: AyahOption[];

  number_in_hafs: number[];
};

/* =========================
   Options (strict union)
========================= */

export type AyahOption =
  | "tafsir"
  | "meanings"
  | "qiraat"
  | "topics"
  | "e3rab"
  | "notes"
  | "asbab"
  | "translations"
  | "similar";

/* =========================
   RawI chain
========================= */

export type Rawi = {
  id: number;
  full_name: string;
  name: string;
  qiraa: Qiraa;
};

export type Qiraa = {
  id: number;
  short_name: string;
  full_name: string;
  count: School;
};

export type School = {
  id: number;
  name: string;
};

/* =========================
   Pagination Support
========================= */

// Mushaf metadata without surahs (lightweight)
export type MushafMetadata = {
  id: number;
  name: string;
  description: string;
  image: string;
  bismillah?: string;
  font_file?: string | null;
  images?: string;
  rawi: Rawi;
  totalSurahs: number; // Total number of surahs (114)
};
