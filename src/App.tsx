import { Outlet } from "react-router-dom";
import { Header } from "./components/layout/header";
import Footer from "./components/layout/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage, useTheme } from "./hooks";

function App() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div>
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
  );
}

export default App;
