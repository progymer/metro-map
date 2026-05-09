"use client";

import { useState, useMemo } from "react";
import { Station, stations } from "@/data/stations";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Props = {
  label: string;
  value: Station | null;
  onChange: (station: Station) => void;
  suggestion?: Station | null;
};

const lineColors: Record<string, string> = {
  line1: "bg-blue-500",
  line2: "bg-red-500",
  line3: "bg-green-500",
};

const StationInput = ({ label, value, onChange, suggestion }: Props) => {
  const [query, setQuery] = useState(value?.name_en ?? "");
  const [showMatches, setShowMatches] = useState(true);

  const matches = useMemo(() => {
    if (!query) return [];
    return stations
      .filter(
        (s) =>
          s.name_en.toLowerCase().includes(query.toLowerCase()) ||
          s.name_ar.includes(query),
      )
      .slice(0, 5);
  }, [query]);

  const handleSelect = (station: Station) => {
    setQuery(station.name_en);
    onChange(station);
    setShowMatches(false);
  };

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>

      <Input
        placeholder="Search in stations..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowMatches(true);
        }}
      />
      {suggestion && !value && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Nearest:</span>
          <Badge
            variant="outline"
            className="cursor-pointer border-blue-400 text-blue-500 hover:bg-blue-400 hover:text-white transition-all flex items-center gap-1.5"
            onClick={() => handleSelect(suggestion)}
          >
            {suggestion.name_en}
            <span className="opacity-60">{suggestion.name_ar}</span>
          </Badge>
        </div>
      )}

      {/* Normal search matches */}
      {showMatches && matches.length > 0 && (
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 no-scrollbar">
          {matches.map((station) => (
            <Badge
              key={station.id}
              variant="secondary"
              className="cursor-pointer hover:border hover:border-blue-400 transition-all flex items-center gap-1.5"
              onClick={() => handleSelect(station)}
            >
              {station.lines.map((line) => (
                <span
                  key={line}
                  className={`w-2 h-2 rounded-full ${lineColors[line]}`}
                />
              ))}
              {station.name_en}
              <span className="opacity-60">{station.name_ar}</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default StationInput;
