import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import type { Client } from "@/services/clientService";

interface ClientSearchProps {
  clients: Client[];
  onSearchResults: (results: Client[]) => void;
}

const ClientSearch = ({ clients, onSearchResults }: ClientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      onSearchResults(clients);
      return;
    }

    const fuseOptions = {
      keys: [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'country',
        'city'
      ],
      threshold: 0.3,
      includeScore: true
    };

    const fuse = new Fuse(clients, fuseOptions);
    const results = fuse.search(searchTerm);
    onSearchResults(results.map(result => result.item));
  }, [searchTerm, clients, onSearchResults]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Search clients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-[300px]"
      />
    </div>
  );
};

export default ClientSearch;