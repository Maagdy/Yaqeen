import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Person, Edit, Save } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdateProfileMutation } from "@/api/domains/user";
import { getProfileSchema, type ProfileFormData } from "@/schemas/user-schemas";
import { toast } from "react-toastify";
import type { ProfileFormProps } from "./profile-form.types";

export const ProfileForm: React.FC<ProfileFormProps> = ({
  firstName,
  lastName,
  email,
  userId,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateProfileMutation(userId);

  const profileSchema = getProfileSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: firstName || "",
      last_name: lastName || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(
      {
        first_name: data.first_name || null,
        last_name: data.last_name || null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success(t("common.saved_successfully") || "Saved successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update profile");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("profile.details")}</CardTitle>
          <CardDescription>{t("profile.manage_info")}</CardDescription>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
        >
          {isEditing ? <Person /> : <Edit />}
        </button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                {t("auth.firstName") || "First Name"}
              </label>
              <input
                {...register("first_name")}
                disabled={!isEditing}
                className={`w-full px-3 py-2 rounded-lg border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  !isEditing
                    ? "opacity-70 border-transparent bg-background"
                    : "border-border"
                }`}
              />
              {errors.first_name && (
                <p className="text-xs text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">
                {t("auth.lastName") || "Last Name"}
              </label>
              <input
                {...register("last_name")}
                disabled={!isEditing}
                className={`w-full px-3 py-2 rounded-lg border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  !isEditing
                    ? "opacity-70 border-transparent bg-background"
                    : "border-border"
                }`}
              />
              {errors.last_name && (
                <p className="text-xs text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              {t("auth.email") || "Email"}
            </label>
            <input
              value={email || ""}
              disabled
              className="w-full px-3 py-2 rounded-lg border border-transparent bg-background text-text-secondary opacity-70 cursor-not-allowed"
            />
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {t("common.save_changes")}
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
