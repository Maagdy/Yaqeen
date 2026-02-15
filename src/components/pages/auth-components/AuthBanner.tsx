import { useTranslation } from "react-i18next";
import { Moshaf } from "@/assets/images";
import { motion } from "framer-motion";

export const AuthBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden  w-1/2">
      <div className="absolute inset-0  z-0" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 p-12 max-w-2xl"
      >
        <img
          src={Moshaf}
          loading="lazy"
          alt="Quran Mushaf"
          className="w-full h-auto object-contain drop-shadow-2xl opacity-90"
        />
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-3xl font-bold text-primary">{t("app.title")}</h2>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            {t("app.description")}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
