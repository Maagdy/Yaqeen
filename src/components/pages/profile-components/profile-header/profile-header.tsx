import { useAuth, useLanguage } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { formatNumber } from "@/utils/numbers";
import { IconButton } from "@/components/common";

interface ProfileHeaderProps {
  displayName: string;
  email: string | null;
  initials: string;
  createdAt: string | null;
}

export const ProfileHeader = ({
  displayName,
  email,
  initials,
  createdAt,
}: ProfileHeaderProps) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 bg-surface p-8 rounded-2xl border border-border shadow-sm">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
        {initials}
      </div>
      <div className="flex-1 text-center md:text-left rtl:md:text-right space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">{displayName}</h1>
        <p className="text-text-secondary">{email}</p>
        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border">
            {t("common.member_since") || "Member since"}{" "}
            {formatNumber(
              new Date(createdAt || "").toLocaleDateString(),
              language,
            )}
          </span>
        </div>
      </div>
      <IconButton
        onClick={handleSignOut}
        icon={<Logout />}
        iconPosition="right"
        variant="primary"
        label={t("auth.signout") || "Sign out"}
      />
    </div>
  );
};
