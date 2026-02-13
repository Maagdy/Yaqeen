import type { ReactNode, MouseEventHandler } from "react";

export interface IconButtonProps {
  icon: ReactNode;
  label?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  href?: string;
  variant?: "default" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  iconPosition?: "left" | "right";
  ariaLabel?: string;
  hideLabelOnMobile?: boolean;
  className?: string;
  disabled?: boolean;
}
