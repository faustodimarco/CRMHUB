import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Client } from "@/services/clientService";

interface ClientFiltersProps {
  clients: Client[];
  onFilterChange: (filtered: Client[]) => void;
}

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
];

type SortOption = "recent" | "revenue-high" | "revenue-low" | "none";

export const ClientFilters = ({ clients, onFilterChange }: ClientFiltersProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("none");

  const applyFilters = (country: string, sort: SortOption) => {
    let filtered = [...clients];

    // Apply country filter
    if (country) {
      filtered = filtered.filter(client => client.country === country);
    }

    // Apply sorting
    switch (sort) {
      case "recent":
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "revenue-high":
        filtered.sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0));
        break;
      case "revenue-low":
        filtered.sort((a, b) => (a.total_revenue || 0) - (b.total_revenue || 0));
        break;
    }

    onFilterChange(filtered);
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    applyFilters(value, sortBy);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    applyFilters(selectedCountry, value);
  };

  const handleReset = () => {
    setSelectedCountry("");
    setSortBy("none");
    onFilterChange(clients);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <Select value={selectedCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.name}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="revenue-high">Revenue (High to Low)</SelectItem>
          <SelectItem value="revenue-low">Revenue (Low to High)</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleReset}>
        Reset Filters
      </Button>
    </div>
  );
};