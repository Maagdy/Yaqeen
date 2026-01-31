import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import type { ErrorPageProps } from "./ErrorPage.types";
import { useTranslation } from "react-i18next";
import {
  ErrorOutline,
  SentimentDissatisfied,
  Home,
  ArrowBack,
  Refresh,
} from "@mui/icons-material";
import { IconButton } from "../../components/common";

const ErrorPage: React.FC<ErrorPageProps> = ({
  title,
  message,
  error: propError,
  showHomeButton = true,
  showBackButton = false,
  showRetryButton = false,
  onRetry,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const routeError = useRouteError();

  // Use prop error or route error
  const error = propError ?? routeError;

  // Get error details
  const getErrorDetails = () => {
    if (isRouteErrorResponse(error)) {
      return {
        title: title ?? `${error.status} ${error.statusText}`,
        message: message ?? error.data?.message ?? t("error.message"),
        status: error.status,
      };
    }

    if (error instanceof Error) {
      return {
        title: title ?? t("error.title"),
        message: message ?? error.message ?? t("error.message"),
        status: undefined,
      };
    }

    return {
      title: title ?? t("error.title"),
      message: message ?? t("error.message"),
      status: undefined,
    };
  };

  const {
    title: errorTitle,
    message: errorMessage,
    status,
  } = getErrorDetails();

  // Determine error icon based on status
  const getErrorIcon = () => {
    if (status === 404) {
      return (
        <SentimentDissatisfied
          className="text-amber-500"
          sx={{ fontSize: 40 }}
        />
      );
    }

    return <ErrorOutline className="text-red-500" sx={{ fontSize: 40 }} />;
  };

  const iconBgColor = status === 404 ? "bg-amber-500/10" : "bg-red-500/10";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl w-full">
        {/* Error Icon */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${iconBgColor}`}
          >
            {getErrorIcon()}
          </div>
        </div>

        {/* Status Code (if available) */}
        {status && (
          <div className="text-6xl font-bold text-text-primary/20 mb-2">
            {status}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          {errorTitle}
        </h1>

        {/* Message */}
        <p className="text-text-secondary mb-8 leading-relaxed">
          {errorMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBackButton && (
            <IconButton
              icon={<ArrowBack />}
              label={t("error.go_back")}
              onClick={() => navigate(-1)}
              variant="ghost"
              size="lg"
              ariaLabel={t("error.go_back")}
            />
          )}

          {showRetryButton && onRetry && (
            <IconButton
              icon={<Refresh />}
              label={t("error.retry")}
              onClick={onRetry}
              variant="primary"
              size="lg"
              ariaLabel={t("error.retry")}
            />
          )}

          {showHomeButton && (
            <IconButton
              icon={<Home />}
              label={t("error.go_home")}
              onClick={() => navigate("/")}
              variant="primary"
              size="lg"
              ariaLabel={t("error.go_home")}
            />
          )}
        </div>

        {/* Debug Info (Development Only) */}
        {import.meta.env.DEV && error instanceof Error && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
              {t("error.show_details")}
            </summary>
            <pre className="mt-2 p-4 bg-secondary/50 rounded-lg text-xs overflow-auto max-h-48">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
