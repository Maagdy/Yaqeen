import type { ReactNode } from "react";

export interface IconButtonProps {
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  iconPosition?: "left" | "right";
  ariaLabel?: string;
  hideLabelOnMobile?: boolean;
  className?: string;
  disabled?: boolean;
}
