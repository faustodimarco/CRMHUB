import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addClient, getClients, type Client } from "@/services/clientService";
import ClientSearch from "./client/ClientSearch";
import AddClientForm from "./client/AddClientForm";
import ClientList from "./client/ClientList";
import { ClientFilters } from "./client/ClientFilters";

const Clients = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchResults, setSearchResults] = useState<Client[]>([]);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const addClientMutation = useMutation({
    mutationFn: (clientData: Omit<Client, 'id' | 'created_at'>) => addClient(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client added",
        description: "The client has been added successfully.",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding client:', error);
    },
  });

  if (isLoading) {
    return <div>Loading clients...</div>;
  }

  const handleFilterChange = (filtered: Client[]) => {
    // If there are search results, apply filters to search results
    // Otherwise, apply filters to all clients
    const baseList = searchResults.length > 0 ? searchResults : clients;
    setFilteredClients(filtered);
  };

  const handleSearchResults = (results: Client[]) => {
    setSearchResults(results);
    // If there are filtered results, apply search to filtered results
    // Otherwise, just set the search results
    setFilteredClients(results);
  };

  const displayedClients = filteredClients.length > 0 ? filteredClients : clients;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Clients</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <AddClientForm onSubmit={addClientMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between gap-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
        <ClientSearch 
          clients={clients} 
          onSearchResults={handleSearchResults}
        />
        <ClientFilters 
          clients={clients}
          onFilterChange={handleFilterChange}
        />
      </div>

      <ClientList clients={displayedClients} />
    </div>
  );
};

export default Clients;
