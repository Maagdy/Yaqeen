export interface ReciterCardProps {
  reciter: {
    id: number;
    name: string;
    letter: string;
    date: string;
    moshaf: Array<{
      id: number;
      name: string;
      server: string;
      surah_total: number;
      moshaf_type: number;
      surah_list: string;
    }>;
  };
  onClick?: () => void;
}
