import { useNavigate } from "react-router-dom";
import { MenuButton } from "@components";
import { ICONS } from "@constants/icons";
import type { Achievement } from "../types";

interface AchievementListGroupProps {
  achievements: Achievement[];
  achievementStatusMap?: Record<string, boolean>;
  label?: string;
  onAchievementClick?: (id: string) => void;
}

export function AchievementListGroup({
  achievements,
  achievementStatusMap,
  label,
  onAchievementClick,
}: AchievementListGroupProps) {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      {label && <div className="font-semibold mb-2">{label}</div>}
      <div className="flex flex-col">
        {achievements.map((achievement) => {
          const completed = achievementStatusMap
            ? achievementStatusMap[String(achievement.id)]
            : false;
          return (
            <MenuButton
              key={achievement.id}
              icon={
                completed ? (
                  <ICONS.selected className="text-success" />
                ) : (
                  <span
                    style={{ width: "1em", display: "inline-block" }}
                  ></span>
                )
              }
              onClick={() =>
                onAchievementClick
                  ? onAchievementClick(String(achievement.id))
                  : navigate(`/dashboard/achievements/${achievement.id}`)
              }
              className="py-2 px-2"
            >
              <span
                className={
                  "font-medium text-base" + (completed ? "" : " text-muted")
                }
              >
                {achievement.name}
              </span>
            </MenuButton>
          );
        })}
      </div>
    </div>
  );
}
