import { useTranslation } from "react-i18next";
import { IconButton } from "../../common/icon-button";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Moshaf } from "../../../assets/images";

export const HomeWelcome: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text Section - Left Half */}
        <section
          className={`flex flex-col gap-4 md:gap-6 text-center ${isRTL ? "lg:text-right" : "lg:text-left"} order-2 lg:order-1`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-text-primary text-4xl md:text-5xl lg:text-7xl font-bold">
              {t("home.header")}
            </h1>
            <h1 className="text-primary text-4xl md:text-5xl lg:text-7xl font-bold">
              {t("home.sub-header")}
            </h1>
          </div>
          <p
            className={`text-text-secondary text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto ${isRTL ? "lg:mr-0" : "lg:ml-0"}`}
          >
            {t("home.description")}
          </p>
          <div className={`flex lg:justify-start justify-center`}>
            <IconButton
              label={t("home.read-quran")}
              variant="primary"
              size="lg"
              iconPosition={isRTL ? "right" : "left"}
              icon={isRTL ? <ArrowBack /> : <ArrowForward />}
            />
          </div>
        </section>

        {/* Image Section - Right Half */}
        <div className="flex justify-center items-center order-1 lg:order-2">
          <img
            src={Moshaf}
            alt="Moshaf"
            className="w-full max-w-md lg:max-w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};
