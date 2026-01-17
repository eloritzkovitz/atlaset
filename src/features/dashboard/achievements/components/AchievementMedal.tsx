import { FaMedal } from "react-icons/fa6";

export function AchievementMedal({ locked }: { locked: boolean }) {
  return (
    <span
      className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center shadow-lg ${
        locked
          ? "bg-muted/30 ring-2 ring-muted"
          : "bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-400 ring-2 ring-yellow-200"
      }`}
      aria-label="Achievement"
      style={{ marginBottom: 18 }}
    >
      <FaMedal
        className={`w-10 h-10 ${locked ? "text-muted" : "text-white drop-shadow"}`}
      />
    </span>
  );
}
