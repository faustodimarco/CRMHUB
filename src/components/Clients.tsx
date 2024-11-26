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

  // Sample clients data
  const clients = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phonePrefix: "+1",
      phoneNumber: "555-0123",
      country: "United States",
      city: "New York",
      website: "https://johndoe.com",
      linkedin: "https://linkedin.com/in/johndoe",
      activeProjects: 2,
      totalRevenue: 12000,
    },
    // Add more sample clients as needed
  ];

  const availableCities = countries.find(c => c.name === selectedCountry)?.cities || [];
  const filteredCities = availableCities.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

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
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
};

export default Clients;
