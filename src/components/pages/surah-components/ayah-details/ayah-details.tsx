import React from "react";
import { useTranslation } from "react-i18next";

interface AyahDetailsProps {
  formattedValues: {
    juz: string;
    page: string;
    hizb: string;
    manzil: string;
  };
}

export const AyahDetails: React.FC<AyahDetailsProps> = React.memo(
  ({ formattedValues }) => {
    const { t } = useTranslation();

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <DetailItem label={t("surah.juz")} value={formattedValues.juz} />
        <DetailItem label={t("surah.page")} value={formattedValues.page} />
        <DetailItem label={t("surah.hizb")} value={formattedValues.hizb} />
        <DetailItem label={t("surah.manzil")} value={formattedValues.manzil} />
      </div>
    );
  },
);

AyahDetails.displayName = "AyahDetails";

const DetailItem: React.FC<{ label: string; value: number | string }> =
  React.memo(({ label, value }) => (
    <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors">
      <span className="block text-xs text-text-secondary mb-1">{label}</span>
      <p className="text-lg font-bold text-primary">{value}</p>
    </div>
  ));

DetailItem.displayName = "DetailItem";
