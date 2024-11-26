import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ClientDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const ClientDetailsDialog = ({ open, onOpenChange, client }: ClientDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <div className="p-2 bg-secondary rounded-md">{client.firstName}</div>
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <div className="p-2 bg-secondary rounded-md">{client.lastName}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <div className="p-2 bg-secondary rounded-md">{client.email}</div>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-2">
            <div className="space-y-2">
              <Label>Phone Prefix</Label>
              <div className="p-2 bg-secondary rounded-md">{client.phonePrefix}</div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="p-2 bg-secondary rounded-md">{client.phoneNumber}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Country</Label>
              <div className="p-2 bg-secondary rounded-md">{client.country}</div>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <div className="p-2 bg-secondary rounded-md">{client.city}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Website</Label>
            <div className="p-2 bg-secondary rounded-md">
              {client.website ? (
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {client.website}
                </a>
              ) : (
                "Not provided"
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>LinkedIn Profile</Label>
            <div className="p-2 bg-secondary rounded-md">
              {client.linkedin ? (
                <a href={client.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {client.linkedin}
                </a>
              ) : (
                "Not provided"
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Active Projects</Label>
              <div className="p-2 bg-secondary rounded-md">{client.activeProjects}</div>
            </div>
            <div className="space-y-2">
              <Label>Total Revenue</Label>
              <div className="p-2 bg-secondary rounded-md">${client.totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;