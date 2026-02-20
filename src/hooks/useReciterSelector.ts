import { useMemo } from "react";
import { useReciters } from "@/api/domains/reciters/useReciters";
import { useLanguage } from "@/hooks/useLanguage";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { padSurahNumber } from "@/utils/surahUtils";

export interface ReciterOption {
  reciterId: number;
  reciterName: string;
  moshafId: number;
  moshafName: string;
  server: string;
}

// Normalize Arabic text: collapse alef variants, taa marbuta, alef maqsura, strip diacritics
export function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0610-\u061A\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, "") // remove tashkeel
    .replace(/[أإآٱ]/g, "ا")  // alef variants → bare alef
    .replace(/ة/g, "ه")       // taa marbuta → ha
    .replace(/ى/g, "ي");      // alef maqsura → ya
}

export function filterReciters(
  options: ReciterOption[],
  inputValue: string,
): ReciterOption[] {
  const query = normalizeArabic(inputValue.toLowerCase().trim());
  if (!query) return options;
  return options.filter((option) =>
    normalizeArabic(option.reciterName.toLowerCase()).includes(query),
  );
}

const DEFAULT_BASIT_SERVER = "https://server7.mp3quran.net/basit";

interface UseReciterSelectorParams {
  surahNumber: number;
}

export function useReciterSelector({ surahNumber }: UseReciterSelectorParams) {
  const { language } = useLanguage();
  const { data: reciters, isLoading } = useReciters({ language });
  const selectedReciterId = usePreferencesStore((s) => s.selectedReciterId);
  const setSelectedReciterId = usePreferencesStore(
    (s) => s.setSelectedReciterId,
  );

  const availableReciters = useMemo(() => {
    if (!reciters) return [];

    const surahStr = String(surahNumber);
    const options: ReciterOption[] = [];

    for (const reciter of reciters) {
      for (const moshaf of reciter.moshaf) {
        const surahList = moshaf.surah_list.split(",");
        if (surahList.includes(surahStr)) {
          options.push({
            reciterId: reciter.id,
            reciterName: reciter.name,
            moshafId: moshaf.id,
            moshafName: moshaf.name,
            server: moshaf.server,
          });
          break; // first moshaf that has this surah
        }
      }
    }

    const locale = language === "ar" ? "ar" : "en";
    options.sort((a, b) =>
      a.reciterName.localeCompare(b.reciterName, locale),
    );

    return options;
  }, [reciters, surahNumber, language]);

  const selectedReciter = useMemo(() => {
    if (availableReciters.length === 0) return null;

    // Try stored preference first
    if (selectedReciterId !== null) {
      const stored = availableReciters.find(
        (r) => r.reciterId === selectedReciterId,
      );
      if (stored) return stored;
    }

    // Fall back to Abdul Basit (match by server URL)
    const basit = availableReciters.find((r) =>
      r.server.includes("basit"),
    );
    if (basit) return basit;

    // Last resort: first available
    return availableReciters[0];
  }, [availableReciters, selectedReciterId]);

  const fullSurahAudioUrl = useMemo(() => {
    const server = selectedReciter?.server ?? DEFAULT_BASIT_SERVER;
    return `${server}/${padSurahNumber(surahNumber)}.mp3`;
  }, [selectedReciter, surahNumber]);

  const onReciterChange = (reciterId: number) => {
    setSelectedReciterId(reciterId);
  };

  return {
    availableReciters,
    selectedReciter,
    fullSurahAudioUrl,
    onReciterChange,
    isLoading,
  };
}
