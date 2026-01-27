import type { LoadingProps } from "./Loading.types";
import { useTranslation } from "react-i18next";

export const Loading: React.FC<LoadingProps> = ({ message, size = "md" }) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {/* Spinner */}
      <div
        className={`${sizeClasses[size]} border-primary/20 border-t-primary rounded-full animate-spin`}
      />
      {/* Message */}
      <p className={`${textSizeClasses[size]} text-text-secondary`}>
        {message || t("common.loading")}
      </p>
    </div>
  );
};
