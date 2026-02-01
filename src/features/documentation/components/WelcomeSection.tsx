import { FaBookOpen } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Card } from "@components";
import { DOCS_CARDS } from "@features/documentation/config/docs";
import { DocSearchResults } from "./DocSearchResults";

export function WelcomeDocsSection() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-2 animate-fade-in">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4">
        <FaBookOpen className="text-6xl" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-1 tracking-tight">
          Atlaset Documentation
        </h1>
        <p className="text-lg md:text-xl text-muted font-medium max-w-xl mx-auto">
          Your companion for mastering Atlaset.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 mt-8 w-full max-w-2xl">
        <DocSearchResults
          placeholder="Search documentation..."
          emptyContent={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 w-full">
              {DOCS_CARDS.map((card) => (
                <Card
                  key={card.title}
                  className="cursor-pointer max-w-xs w-full p-8 rounded-xl shadow-lg text-center font-sans flex flex-col items-center hover:bg-primary/50 hover:scale-105 transition"
                  onClick={() =>
                    navigate(`/documentation/${card.file.replace(/\.md$/, "")}`)
                  }
                >
                  {card.icon}
                  <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                  <p className="text-muted text-sm">{card.description}</p>
                </Card>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
}
