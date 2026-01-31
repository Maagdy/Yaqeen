export interface ErrorPageProps {
  title?: string;
  message?: string;
  error?: unknown;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  showRetryButton?: boolean;
  onRetry?: () => void;
}
