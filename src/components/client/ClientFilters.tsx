import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ArrowUpDown, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { Client } from "@/services/clientService";

interface ClientFiltersProps {
  clients: Client[];
  onFilterChange: (filtered: Client[]) => void;
}

export const ClientFilters = ({ clients, onFilterChange }: ClientFiltersProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "revenue-high" | "revenue-low" | "none">("none");

  // Get unique countries from clients
  const countries = Array.from(new Set(clients.map(client => client.country))).filter(Boolean);

  const applyFilters = (country: string, sort: typeof sortBy) => {
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

  const handleSortChange = (value: typeof sortBy) => {
    setSortBy(value);
    applyFilters(selectedCountry, value);
  };

  const handleReset = () => {
    setSelectedCountry("");
    setSortBy("none");
    onFilterChange(clients);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
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
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleReset} 
        className="text-muted-foreground hover:text-foreground"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};