import { Footer } from "../Footer/Footer";
import { useEffect, useRef, useState } from "react";
import { PublicHeader } from "../Header/PublicHeader";

interface PublicLayoutProps {
  children: React.ReactNode;
  showAuthButtons?: boolean;
  footer?: React.ReactNode;
}

export function PublicLayout({
  children,
  showAuthButtons = false,
  footer,
}: PublicLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  // Check if content overflows the viewport height
  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return;
      setIsOverflow(containerRef.current.scrollHeight > window.innerHeight);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        `w-full bg-bg py-0 ` +
        (isOverflow
          ? "h-screen overflow-y-auto"
          : "min-h-screen flex flex-col")
      }
    >
      <PublicHeader showAuthButtons={showAuthButtons} />
      <main className="flex flex-col items-center flex-1 justify-center">
        {children}
      </main>
      <Footer>{footer}</Footer>
    </div>
  );
}
