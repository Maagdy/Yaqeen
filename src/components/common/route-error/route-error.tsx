import { useRouteError } from "react-router-dom";
import ErrorPage from "../../../pages/ErrorPage/ErrorPage";
import { useTranslation } from "react-i18next";

export const RouteError: React.FC = () => {
  const error = useRouteError() as Error;
  const { t } = useTranslation();

  return (
    <ErrorPage
      title={t("error.title")}
      // @ts-expect-error - Error message is a dynamic key from loader
      message={t(error.message || "error.message")}
    />
  );
};
