import { Card } from "@components";
import { ICONS } from "@constants/icons";
import type { CountryFact } from "../../types";

interface CountryFactsContentProps {
  facts: CountryFact[];
}

/** Displays interesting facts about a country. */
export function CountryFactsContent({ facts }: CountryFactsContentProps) {
  if (!facts.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {facts.map((fact) => (
        <Card key={fact.id}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-input shrink-0">
              <ICONS.didYouKnow className="text-lg" />
            </div>

            <p className="text-base leading-relaxed">{fact.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
