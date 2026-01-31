import { useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/layout/header";
import ErrorPage from "../ErrorPage/ErrorPage";
import Footer from "../../components/layout/footer";

export const AppErrorBoundary = () => {
  const error = useRouteError();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ErrorPage
          error={error}
          showHomeButton
          showBackButton
          message={t("app.not-found-message")}
          title={t("app.error-page-title")}
        />
      </main>
      <Footer />
    </div>
  );
};
