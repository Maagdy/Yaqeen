export interface SurahNavigationContextType {
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: (() => void) | undefined;
  onPrevious: (() => void) | undefined;
  setNavigationHandlers: (handlers: {
    onNext?: () => void;
    onPrevious?: () => void;
    canGoNext?: boolean;
    canGoPrevious?: boolean;
  }) => void;
  clearNavigationHandlers: () => void;
}
