import * as z from "zod";
import type { TFunction } from "i18next";

export const getProfileSchema = (t: TFunction) =>
  z.object({
    first_name: z
      .string()
      .min(2, t("validation.first_name_short") || "First name is too short")
      .optional()
      .or(z.literal("")),
    last_name: z
      .string()
      .min(2, t("validation.last_name_short") || "Last name is too short")
      .optional()
      .or(z.literal("")),
  });

export type ProfileFormData = z.infer<ReturnType<typeof getProfileSchema>>;
