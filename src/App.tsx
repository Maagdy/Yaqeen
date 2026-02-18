import { Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "./components/layout/header";
import Footer from "./components/layout/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage, useTheme } from "./hooks";
import { ScrollToTop, RamadanSideBadge } from "./components/common";
import { OfflineIndicator } from "./components/common/offline-indicator";

function App() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <HelmetProvider>
      <div>
        <ScrollToTop />
        <RamadanSideBadge />
        <OfflineIndicator />
        <Header />
        <ToastContainer
          position={language === "ar" ? "bottom-right" : "bottom-left"}
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          className="z-9999!"
          theme={theme}
        />
        <Outlet />
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
