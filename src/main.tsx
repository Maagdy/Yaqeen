// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/config";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import { QueryProvider } from "./providers/QueryProvider";

import { router } from "./router/router";
import { AudioProvider } from "./providers/AudioProvider";
import { SurahNavigationProvider } from "./providers/SurahNavigationProvider";
import { GlobalAudioPlayer } from "./components/common/global-audio-player";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <AudioProvider>
          <SurahNavigationProvider>
            <RouterProvider router={router} />
            <GlobalAudioPlayer />
          </SurahNavigationProvider>
        </AudioProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
);
