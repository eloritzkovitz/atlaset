import { useTranslation } from "react-i18next";
import { Card } from "@components";
import { ICONS } from "@constants/icons";
import type { CountryFact } from "@features/countries/types";

interface DiscoverFactCardProps {
  facts?: CountryFact[];
  loading?: boolean;
}

/** Displays random country facts. */
export function DiscoverFactCard({
  facts = [],
  loading = false,
}: DiscoverFactCardProps) {
  const { t } = useTranslation("explore");

  if (loading) {
    return (
      <Card
        title={t("discover.didYouKnow.title", "Did You Know?")}
        icon={ICONS.info}
        loading
        skeletonLines={3}
      />
    );
  }

  if (!facts.length) {
    return null;
  }

  return (
    <Card title={t("discover.didYouKnow.title", "Did You Know?")}>
      <div className="space-y-4">
        {facts.map((fact) => (
          <div key={fact.id} className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-alt shrink-0">
              <ICONS.didYouKnow className="text-lg" />
            </div>

            <div className="text-base leading-relaxed">{fact.description}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
