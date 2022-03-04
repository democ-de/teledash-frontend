import { Badge } from "components/Elements/Badge";
import { startCase } from "lodash";
import { useState, useEffect } from "react";
import { FilterKeys, FilterValues } from "..";

type ActiveFilters = {
  label: string;
  key: string;
}[];

const parseActiveFilters = (params?: { [key: string]: any }): ActiveFilters => {
  if (!params) {
    return [];
  }

  const result = [];
  for (const [key, value] of Object.entries(params)) {
    if (key === "search") {
      continue;
    }

    if (typeof value === "boolean") {
      result.push({ label: startCase(key), key });
    } else if (Array.isArray(value)) {
      result.push({ label: `${startCase(key)} (${value.length})`, key });
    } else if (["date_from", "date_to"].includes(key)) {
      result.push({ label: `${startCase(key)}`, key });
    } else {
      result.push({ label: `${startCase(key)}: ${startCase(value)}`, key });
    }
  }

  return result;
};

export const ActiveFilterBadges = ({
  activeOptions,
  onRemoveFilter,
}: {
  activeOptions?: FilterValues<FilterKeys>;
  onRemoveFilter: (key: string) => void;
}) => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>([]);

  useEffect(() => {
    setActiveFilters(parseActiveFilters(activeOptions));
  }, [activeOptions]);

  if (!activeFilters.length) {
    return null;
  }

  return (
    <div className="flex items-center mt-4">
      {activeFilters.map(({ key, label }) => (
        <Badge
          key={key}
          label={label}
          variant="indigo"
          hasBorder
          size="lg"
          className="mr-1.5"
          onClose={() => onRemoveFilter(key)}
        />
      ))}
    </div>
  );
};
