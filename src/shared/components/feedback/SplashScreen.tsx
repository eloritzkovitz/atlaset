import { Branding } from "@layout";
import "./SplashScreen.css";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-bg">
      <div className="mb-10 flex items-center justify-center">
        <Branding size={156} />
      </div>
      <div className="flex gap-2 mt-2">
        <span
          className="splash-dot animate-bounce-dot"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="splash-dot animate-bounce-dot"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="splash-dot animate-bounce-dot"
          style={{ animationDelay: "0.3s" }}
        />
      </div>      
    </div>
  );
}
