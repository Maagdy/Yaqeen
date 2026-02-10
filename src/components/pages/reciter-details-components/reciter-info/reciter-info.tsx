import { Favorite, Share } from "@mui/icons-material";
import { IconButton, MushafCard } from "../../../common";
import type { ReciterInfoProps } from "./reciter-info.types";
import { useAuth } from "@/hooks";
import {
  useAddFavoriteReciterMutation,
  useRemoveFavoriteReciterMutation,
  useFavoriteRecitersQuery,
} from "@/api/domains/user/useUserQueries";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getReciters } from "@/api";
import { useLanguage } from "@/hooks";
import { useState } from "react";

export const ReciterInfo: React.FC<ReciterInfoProps> = ({
  reciter,
  selectedMoshafIndex,
  onMoshafSelect,
}) => {
  const selectedMoshaf = reciter?.moshaf[selectedMoshafIndex];
  const { isLoggedIn, user } = useAuth();
  const { data: reciters } = useFavoriteRecitersQuery(user?.id);
  const { mutate: addFavoriteReciter, isPending: isAdding } =
    useAddFavoriteReciterMutation(user?.id);
  const { mutate: removeFavoriteReciter, isPending: isRemoving } =
    useRemoveFavoriteReciterMutation(user?.id);

  const isReciterFavorite = reciters?.some(
    (fav) => fav.reciter_id === reciter?.id,
  );

  const { t } = useTranslation();

  const { language } = useLanguage();
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.warning(t("reciter-details.login_to_favorite"));
      return;
    }

    if (!reciter) return;

    if (isReciterFavorite) {
      removeFavoriteReciter(reciter.id, {
        onSuccess: () =>
          toast.success(t("reciter-details.removed_from_favorites")),
        onError: () =>
          toast.error(t("reciter-details.error_removing_favorite")),
      });
    } else {
      setIsFetchingInfo(true);
      try {
        let nameAr = reciter.name;
        let nameEn = reciter.englishName;

        if (language === "en") {
          nameEn = reciter.name;
          try {
            const arData = await getReciters({
              reciter: reciter.id,
              language: "ar",
            });
            if (arData?.[0]) nameAr = arData[0].name;
          } catch (error) {
            console.error("Failed to fetch Arabic name", error);
          }
        } else {
          try {
            const enData = await getReciters({
              reciter: reciter.id,
              language: "eng",
            });
            if (enData?.[0]) nameEn = enData[0].name;
          } catch (error) {
            console.error("Failed to fetch English name", error);
          }
        }

        addFavoriteReciter(
          {
            reciterId: reciter.id,
            reciterName: nameAr,
            reciterNameEnglish: nameEn,
          },
          {
            onSuccess: () =>
              toast.success(t("reciter-details.added_to_favorites")),
            onError: () =>
              toast.error(t("reciter-details.error_adding_favorite")),
          },
        );
      } finally {
        setIsFetchingInfo(false);
      }
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("reciter-details.link_copied"));
    } catch (error) {
      console.log(error);

      toast.error(t("reciter-details.link_copy_failed"));
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-primary">{reciter?.name}</h1>
          <p className="text-text-secondary text-base lg:text-lg">
            {selectedMoshaf?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Share fontSize="medium" />}
            onClick={handleShare}
            className="text-primary/70 hover:text-primary"
            size="sm"
          />
          <IconButton
            icon={
              <Favorite
                fontSize="medium"
                color={isReciterFavorite ? "primary" : "inherit"}
              />
            }
            onClick={toggleFavorite}
            disabled={isAdding || isRemoving || isFetchingInfo}
            className="text-primary/70 hover:text-primary"
            size="sm"
          />
        </div>{" "}
      </div>
      {/* Moshaf Selection Chips */}
      {reciter?.moshaf && reciter.moshaf.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {reciter.moshaf.map((m, index) => (
            <MushafCard
              key={m.id}
              name={m.name}
              active={selectedMoshafIndex === index}
              onClick={() => onMoshafSelect(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
