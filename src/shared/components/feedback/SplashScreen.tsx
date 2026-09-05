import { Branding } from "../media/branding/Branding";
import "./SplashScreen.css";

interface SplashDotProps {
  delay: number;
}

export function SplashDot({ delay }: SplashDotProps) {
  return (
    <span
      className="inline-block h-4 w-4 rounded-full bg-blue-600 opacity-70 dark:bg-gray-200 animate-bounce-dot"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

/** A splash screen component that displays a branding and animated dots. */
export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-bg">
      <div className="mb-10 flex items-center justify-center">
        <Branding size={156} />
      </div>
      <div className="flex gap-2 mt-2">
        <SplashDot delay={0} />
        <SplashDot delay={0.15} />
        <SplashDot delay={0.3} />
      </div>
    </div>
  );
}
