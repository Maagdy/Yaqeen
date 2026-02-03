import type { IconButtonProps } from "./icon-button.types";

export function IconButton({
  icon,
  label,
  onClick,
  href,
  variant = "default",
  size = "md",
  iconPosition = "left",
  ariaLabel,
  hideLabelOnMobile = false,
  className = "",
}: IconButtonProps) {
  const baseClasses =
    "flex cursor-pointer items-center gap-2 rounded-lg transition-all font-medium justify-center";

  const variantClasses = {
    default: "bg-background text-text-primary hover:text-primary",
    primary: "bg-primary text-white hover:opacity-90",
    ghost: "bg-surface text-text-primary hover:text-primary",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {iconPosition === "left" && (
        <span
          className={`${iconSizeClasses[size]} flex items-center justify-center shrink-0`}
        >
          {icon}
        </span>
      )}
      {label && (
        <span className={hideLabelOnMobile ? "hidden md:inline" : ""}>
          {label}
        </span>
      )}
      {iconPosition === "right" && (
        <span className={iconSizeClasses[size]}>{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel || label}>
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel || label}
    >
      {content}
    </button>
  );
}
