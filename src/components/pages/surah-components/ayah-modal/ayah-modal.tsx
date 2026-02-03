import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { IconButton } from "../../../common";
import { useLanguage } from "../../../../hooks";
import type { AyahModalProps } from "./ayah-modal.types";
import { formatNumber } from "../../../../utils/numbers";

export const AyahModal: React.FC<AyahModalProps> = ({
  open,
  onClose,
  ayah,
  surah,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (!ayah) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" component="span" className="font-bold">
          {t("surah.ayah-details")}
        </Typography>
        <IconButton
          icon={<Close />}
          onClick={onClose}
          label={t("common.close")}
          size="sm"
          className="bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
        />
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={4}>
          {/* Surah Info Header */}
          <Box className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
            <Typography
              variant="h3"
              className={`font-bold mb-2 text-primary ${language === "ar" ? "font-amiri" : ""}`}
            >
              {language === "ar" ? surah.name : surah.englishName}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              className="mb-4"
            >
              {language === "ar" ? surah.englishName : surah.name} •{" "}
              {surah.englishNameTranslation}
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Chip
                label={t(
                  surah.revelationType.toLowerCase() === "meccan"
                    ? "home.revelation_place.makkah"
                    : "home.revelation_place.madinah",
                )}
                size="small"
                variant="outlined"
                color="primary"
                className="font-medium"
              />
              <Chip
                label={`${formatNumber(surah.numberOfAyahs, language)} ${t("home.verses")}`}
                size="small"
                variant="outlined"
                color="primary"
                className="font-medium"
              />
            </Stack>
          </Box>

          <Divider>
            <Chip
              label={
                t("surah.verse") +
                " " +
                formatNumber(ayah.numberInSurah, language)
              }
              size="small"
            />
          </Divider>

          {/* Ayah Text */}
          <Box className="text-center py-2">
            <Typography
              variant="h4"
              className="font-amiri leading-loose text-primary"
              sx={{ lineHeight: 2.5, fontSize: { xs: "1.5rem", md: "2.2rem" } }}
              dir="rtl"
            >
              {ayah.text}
            </Typography>
          </Box>

          <Divider />

          {/* Details Grid */}
          <Box className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <DetailItem
              label={t("surah.juz")}
              value={formatNumber(ayah.juz, language)}
            />
            <DetailItem
              label={t("surah.page")}
              value={formatNumber(ayah.page, language)}
            />
            <DetailItem
              label={t("surah.hizb")}
              value={formatNumber(ayah.hizbQuarter, language)}
            />
            <DetailItem
              label={t("surah.manzil")}
              value={formatNumber(ayah.manzil, language)}
            />
          </Box>

          {/* Sajda Info if applicable */}
          {ayah.sajda && (
            <Box className="flex justify-center">
              <Chip
                label={t("surah.sajda")}
                color="primary"
                variant="outlined"
                className="font-bold"
              />
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <Box className="p-3 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors">
    <Typography
      variant="caption"
      color="text.secondary"
      display="block"
      mb={0.5}
    >
      {label}
    </Typography>
    <Typography variant="h6" className="font-bold text-primary">
      {value}
    </Typography>
  </Box>
);

export default AyahModal;
