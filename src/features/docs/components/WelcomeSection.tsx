import { useNavigate } from "react-router-dom";
import { Card } from "@components";
import { DocSearchResults } from "./DocSearchResults";
import { DOCS_CARDS } from "../config/docs";

export function WelcomeDocsSection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-2 animate-fade-in px-2 sm:px-4">
      <div className="w-full flex flex-col items-center gap-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1 tracking-tight">
          Atlaset Docs
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted font-medium mx-auto">
          Your companion for mastering Atlaset.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 mt-8 w-full">
        <DocSearchResults
          placeholder="Search documentation..."
          emptyContent={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 w-full">
              {DOCS_CARDS.map((card) => (
                <Card
                  key={card.title}
                  className="cursor-pointer w-full h-full min-h-[220px] min-w-0 flex flex-col items-center justify-between p-6 sm:p-8 rounded-xl shadow-lg text-center font-sans hover:bg-primary/50 hover:scale-105 transition"
                  onClick={() =>
                    navigate(`/docs/${card.file.replace(/\.md$/, "")}`)
                  }
                >
                  <div className="flex flex-col items-center flex-1 w-full">
                    {card.icon}
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 mt-2">
                      {card.title}
                    </h2>
                    <p className="text-muted text-xs sm:text-sm flex-1 flex items-center justify-center w-full">
                      {card.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
}
