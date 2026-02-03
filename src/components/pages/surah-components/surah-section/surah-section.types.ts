import type { ReactNode } from "react";

export type SurahSectionProps = {
  title?: ReactNode; // allow icon + text
  description?: ReactNode; // text or JSX
  headerAction?: ReactNode; // button/link on right side
  children?: ReactNode; // body
  className?: string;
};
