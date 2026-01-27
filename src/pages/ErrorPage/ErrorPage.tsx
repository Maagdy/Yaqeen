import { useNavigate } from "react-router-dom";
import type { ErrorPageProps } from "./ErrorPage.types";
import { useTranslation } from "react-i18next";

const ErrorPage: React.FC<ErrorPageProps> = ({
  title,
  message,
  showHomeButton = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          {title || t("error.title")}
        </h1>

        {/* Message */}
        <p className="text-text-secondary mb-8">
          {message || t("error.message")}
        </p>

        {/* Home Button */}
        {showHomeButton && (
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {t("error.go_home")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
