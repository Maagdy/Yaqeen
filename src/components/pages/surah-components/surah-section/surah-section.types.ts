import type { ReactNode } from "react";

export type SurahSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  children?: ReactNode;
  className?: string;
};
