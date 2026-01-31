import type { JuzData } from "../../api";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type JuzPageProps = {};

export interface JuzLoaderData {
  juz: JuzData;
  juzNumber: number;
  edition: string;
}
