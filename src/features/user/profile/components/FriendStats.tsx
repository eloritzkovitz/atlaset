import { useTranslation } from "react-i18next";

interface FriendStatsProps {
  canEdit?: boolean;
  friendCount?: number;
  mutualFriendCount?: number;
  onFriendCountClick?: () => void;
  onMutualCountClick?: () => void;
}

export function FriendStats({
  canEdit,
  friendCount,
  mutualFriendCount,
  onFriendCountClick,
  onMutualCountClick,
}: FriendStatsProps) {
  const { t } = useTranslation("user");

  return (
    <div className="flex items-center gap-2 text-base font-semibold text-muted">
      {typeof friendCount === "number" ? (
        <>
          <button
            type="button"
            className="hover:underline focus:outline-none"
            onClick={onFriendCountClick}
            disabled={!onFriendCountClick}
            aria-label={t("profile.header.showFriendsList")}
          >
            {t("friends.counts.friend", { count: friendCount })}
          </button>
          {!canEdit &&
            typeof mutualFriendCount === "number" &&
            mutualFriendCount > 0 && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onMutualCountClick}
                  className="text-sm text-muted/80 transition-colors hover:text-foreground hover:underline"
                >
                  {t("friends.counts.mutualFriend", {
                    count: mutualFriendCount,
                  })}
                </button>
              </>
            )}
        </>
      ) : (
        <span className="text-base text-muted">
          {t("friends.status.loading")}
        </span>
      )}
    </div>
  );
}
