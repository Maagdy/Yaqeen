import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalFireDepartment, MenuBook } from "@mui/icons-material";
import type { ProfileStatsProps } from "./profile-stats.types";

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  currentStreak,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("profile.activity")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <LocalFireDepartment />
          </div>
          <div>
            <p className="text-sm text-text-secondary">
              {t("profile.current_streak")}
            </p>
            <p className="text-xl font-bold">
              {currentStreak} {t("common.days")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <MenuBook />
          </div>
          <div>
            <p className="text-sm text-text-secondary">
              {t("profile.total_pages_read")}
            </p>
            <p className="text-xl font-bold">-</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
