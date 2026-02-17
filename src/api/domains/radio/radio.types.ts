export type Radio = {
  id: number;
  name: string;
  url: string;
  recent_date: Date | string;
  secondaryName?: string; // Optional secondary name for bilingual display
};
export interface RadioResponse {
  radios: Radio[];
}
