import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Client } from "@/services/clientService";
import PhoneInput from "./PhoneInput";
import { phonePrefixes } from "@/data/phonePrefixes";

// Get unique countries and sort them alphabetically
const countries = [...new Set(phonePrefixes.map(p => p.country))]
  .sort()
  .map(country => ({
    name: country,
    // Find a major city for each country (this is a placeholder - you might want to replace with real city data)
    cities: ["Capital City"]
  }));

interface AddClientFormProps {
  onSubmit: (client: Omit<Client, 'id' | 'created_at'>) => void;
}

const AddClientForm = ({ onSubmit }: AddClientFormProps) => {
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonePrefix: "+1-US",
    phoneNumber: "",
    country: "",
    city: "",
    website: "",
    linkedin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [prefix] = newClient.phonePrefix.split('-');
    const clientData = {
      first_name: newClient.firstName,
      last_name: newClient.lastName,
      email: newClient.email,
      phone_prefix: prefix,
      phone_number: newClient.phoneNumber,
      country: newClient.country,
      city: newClient.city,
      website: newClient.website,
      linkedin: newClient.linkedin,
    };
    onSubmit(clientData);
  };

  return (
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

      <PhoneInput
        phonePrefix={newClient.phonePrefix}
        phoneNumber={newClient.phoneNumber}
        onPrefixChange={(value) => setNewClient({ ...newClient, phonePrefix: value })}
        onNumberChange={(value) => setNewClient({ ...newClient, phoneNumber: value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={newClient.country}
            onValueChange={(value) =>
              setNewClient({ ...newClient, country: value, city: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.name} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Select
            value={newClient.city}
            onValueChange={(value) =>
              setNewClient({ ...newClient, city: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {countries
                .find((c) => c.name === newClient.country)
                ?.cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
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
  );
};

export default AddClientForm;