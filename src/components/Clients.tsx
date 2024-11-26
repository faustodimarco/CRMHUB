import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ClientCard from "./client/ClientCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addClient, getClients, type Client } from "@/services/clientService";

const countries = [
  { code: "US", name: "United States", cities: ["New York", "Los Angeles", "Chicago"] },
  { code: "GB", name: "United Kingdom", cities: ["London", "Manchester", "Birmingham"] },
  { code: "FR", name: "France", cities: ["Paris", "Lyon", "Marseille"] },
];

const phonePrefixes = [
  { code: "US", prefix: "+1" },
  { code: "GB", prefix: "+44" },
  { code: "FR", prefix: "+33" },
];

const Clients = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonePrefix: "+1",
    phoneNumber: "",
    country: "",
    city: "",
    website: "",
    linkedin: "",
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

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
        description: `${newClient.firstName} ${newClient.lastName} has been added to your clients.`,
      });
      setNewClient({
        firstName: "",
        lastName: "",
        email: "",
        phonePrefix: "+1",
        phoneNumber: "",
        country: "",
        city: "",
        website: "",
        linkedin: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientData = {
      first_name: newClient.firstName,
      last_name: newClient.lastName,
      email: newClient.email,
      phone_prefix: newClient.phonePrefix,
      phone_number: newClient.phoneNumber,
      country: newClient.country,
      city: newClient.city,
      website: newClient.website,
      linkedin: newClient.linkedin,
    };
    addClientMutation.mutate(clientData);
  };

  const availableCities = countries.find(c => c.name === selectedCountry)?.cities || [];
  const filteredCities = availableCities.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading clients...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Clients</h2>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newClient.firstName}
                    onChange={(e) =>
                      setNewClient({ ...newClient, firstName: e.target.value })
                    }
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newClient.lastName}
                    onChange={(e) =>
                      setNewClient({ ...newClient, lastName: e.target.value })
                    }
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-2">
                <div className="space-y-2">
                  <Label>Phone Prefix</Label>
                  <Select
                    value={newClient.phonePrefix}
                    onValueChange={(value) =>
                      setNewClient({ ...newClient, phonePrefix: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select prefix" />
                    </SelectTrigger>
                    <SelectContent>
                      {phonePrefixes.map((prefix) => (
                        <SelectItem key={prefix.code} value={prefix.prefix}>
                          {prefix.prefix}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={newClient.phoneNumber}
                    onChange={(e) =>
                      setNewClient({ ...newClient, phoneNumber: e.target.value })
                    }
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={(value) => {
                      setSelectedCountry(value);
                      setNewClient({ ...newClient, country: value, city: "" });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Popover open={citySearchOpen} onOpenChange={setCitySearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {newClient.city || "Select city..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" side="bottom" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search city..."
                          value={citySearch}
                          onValueChange={setCitySearch}
                        />
                        <CommandList>
                          {filteredCities.map((city) => (
                            <CommandItem
                              key={city}
                              onSelect={() => {
                                setNewClient({ ...newClient, city });
                                setCitySearchOpen(false);
                                setCitySearch("");
                              }}
                            >
                              {city}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={newClient.website}
                  onChange={(e) =>
                    setNewClient({ ...newClient, website: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={newClient.linkedin}
                  onChange={(e) =>
                    setNewClient({ ...newClient, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <Button type="submit" className="w-full">
                Add Client
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <ClientCard 
            key={client.id} 
            client={{
              id: client.id!,
              firstName: client.first_name,
              lastName: client.last_name,
              email: client.email,
              phonePrefix: client.phone_prefix,
              phoneNumber: client.phone_number,
              country: client.country,
              city: client.city,
              website: client.website || '',
              linkedin: client.linkedin || '',
              activeProjects: 0,
              totalRevenue: 0,
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default Clients;
