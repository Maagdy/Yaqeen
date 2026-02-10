export interface SearchResult {
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
  };
  ayah: number;
  number: number;
  text: string;
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
}

export interface SearchMeta {
  count: number;
  page?: number;
  total_pages?: number;
}

export interface SearchResponse {
  code: number;
  status: string;
  data: {
    count: number;
    matches: SearchResult[];
  };
}

export interface SearchParams {
  keyword: string;
  scope?: string | number; // Surah number or 'all'
  edition?: string; // e.g., 'en.pickthall'
}
