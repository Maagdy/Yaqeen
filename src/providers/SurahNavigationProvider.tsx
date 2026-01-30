import { useCallback, useState } from "react";
import { SurahNavigationContext } from "../contexts/surah-navigation-context";

export const SurahNavigationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [onNext, setOnNext] = useState<(() => void) | undefined>(undefined);
  const [onPrevious, setOnPrevious] = useState<(() => void) | undefined>(
    undefined,
  );

  const setNavigationHandlers = useCallback(
    (handlers: {
      onNext?: () => void;
      onPrevious?: () => void;
      canGoNext?: boolean;
      canGoPrevious?: boolean;
    }) => {
      if (handlers.onNext !== undefined) {
        setOnNext(() => handlers.onNext);
      }
      if (handlers.onPrevious !== undefined) {
        setOnPrevious(() => handlers.onPrevious);
      }
      if (handlers.canGoNext !== undefined) {
        setCanGoNext(handlers.canGoNext);
      }
      if (handlers.canGoPrevious !== undefined) {
        setCanGoPrevious(handlers.canGoPrevious);
      }
    },
    [],
  );

  const clearNavigationHandlers = useCallback(() => {
    setOnNext(undefined);
    setOnPrevious(undefined);
    setCanGoNext(false);
    setCanGoPrevious(false);
  }, []);

  return (
    <SurahNavigationContext.Provider
      value={{
        canGoNext,
        canGoPrevious,
        onNext,
        onPrevious,
        setNavigationHandlers,
        clearNavigationHandlers,
      }}
    >
      {children}
    </SurahNavigationContext.Provider>
  );
};
