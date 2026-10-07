import { useNavigate } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BIHAR_CITIES, DEFAULT_CITY } from "@/data/locations";
import { cn } from "@/lib/utils";

export function SearchBar({
  className,
  initialQuery = "",
  initialCity = DEFAULT_CITY,
}: {
  className?: string;
  initialQuery?: string;
  initialCity?: string;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);

  return (
    <form
      className={cn("glass-strong rounded-3xl p-3 sm:p-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/find-doctors", search: { q: query || undefined, city } });
      }}
      role="search"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <label htmlFor="search-query" className="sr-only">
            What are you looking for?
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="search-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Doctor, specialty, clinic or service"
            className="h-12 rounded-2xl border-transparent bg-card/80 pl-10 text-base"
          />
        </div>

        <div className="relative md:w-56">
          <label htmlFor="search-city" className="sr-only">
            Location
          </label>
          <MapPin
            className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-primary"
            aria-hidden="true"
          />
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger
              id="search-city"
              className="h-12! rounded-2xl border-transparent bg-card/80 pl-10 text-base"
            >
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {BIHAR_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="h-12 rounded-2xl px-8 text-base">
          Search
        </Button>
      </div>
      <p className="mt-3 px-1 text-xs text-muted-foreground">
        Try: “Cardiologist in Muzaffarpur”, “Dermatologist near me”, “General physician”
      </p>
    </form>
  );
}
