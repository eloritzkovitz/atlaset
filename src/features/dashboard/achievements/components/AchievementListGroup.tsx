import { MenuButton } from "@components";
import { FaCheck } from "react-icons/fa6";
import type { Achievement } from "../types";
import { useNavigate } from "react-router-dom";

interface AchievementListGroupProps {
  achievements: Achievement[];
  achievementStatusMap?: Record<string, boolean>;
  label?: string;
}

export function AchievementListGroup({
  achievements,
  achievementStatusMap,
  label,
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
                  <FaCheck className="text-success" />
                ) : (
                  <span style={{ width: "1em", display: "inline-block" }}></span>
                )
              }
              onClick={() =>
                navigate(`/dashboard/achievements/${achievement.id}`)
              }
              className="py-2 px-2"
            >
              <span className={"font-medium text-base" + (completed ? "" : " text-muted")}>{achievement.name}</span>
            </MenuButton>
          );
        })}
      </div>
    </div>
  );
}
