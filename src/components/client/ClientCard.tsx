import { Card } from "@/components/ui/card";
import { useState } from "react";
import ClientDetailsDialog from "./ClientDetailsDialog";

interface ClientCardProps {
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phonePrefix: string;
    phoneNumber: string;
    country: string;
    city: string;
    website: string;
    linkedin: string;
    activeProjects: number;
    totalRevenue: number;
  };
}

const ClientCard = ({ client }: ClientCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card 
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {client.firstName[0]}{client.lastName[0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{client.firstName} {client.lastName}</h3>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Projects</span>
            <span className="font-medium">{client.activeProjects}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Total Revenue</span>
            <span className="font-medium">${client.totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </Card>
      <ClientDetailsDialog 
        open={showDetails} 
        onOpenChange={setShowDetails}
        client={client}
      />
    </>
  );
};

export default ClientCard;