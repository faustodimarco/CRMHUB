import { useAuth } from "@/contexts/AuthContext";
import type { Client } from "@/services/clientService";
import ClientCard from "./ClientCard";

interface ClientListProps {
  clients: Client[];
}

const ClientList = ({ clients }: ClientListProps) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
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
  );
};

export default ClientList;