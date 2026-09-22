import { Link } from "react-router-dom";
import { Card } from "@components";
import { DOCS_CARDS } from "../constants/docsCards";

export function DocsCards() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8">
      {DOCS_CARDS.map((card) => (
        <Card
          key={card.title}
          className="flex h-full min-h-[220px] min-w-0 w-full cursor-pointer flex-col items-center justify-between rounded-xl p-6 text-center font-sans shadow-lg transition hover:scale-105 hover:bg-primary/50 sm:p-8"
        >
          <Link
            to={`/docs/${card.file.replace(/\.md$/, "")}`}
            className="flex h-full w-full flex-1 flex-col items-center"
          >
            {card.icon}

            <h2 className="mt-2 mb-2 text-lg font-semibold sm:text-xl">
              {card.title}
            </h2>

            <p className="flex w-full flex-1 items-center justify-center text-xs text-muted sm:text-sm">
              {card.description}
            </p>
          </Link>
        </Card>
      ))}
    </div>
  );
}
