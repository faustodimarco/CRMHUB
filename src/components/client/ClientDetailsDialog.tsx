import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient, deleteClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import ClientField from "./ClientField";
import DeleteClientDialog from "./DeleteClientDialog";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(client);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: (updatedData: typeof client) => updateClient(client.id, {
      first_name: updatedData.firstName,
      last_name: updatedData.lastName,
      email: updatedData.email,
      phone_prefix: updatedData.phonePrefix,
      phone_number: updatedData.phoneNumber,
      country: updatedData.country,
      city: updatedData.city,
      website: updatedData.website,
      linkedin: updatedData.linkedin,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client updated",
        description: "The client information has been successfully updated.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update client information.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteClient(client.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client deleted",
        description: "The client has been successfully removed.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete client.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(editedClient);
  };

  const handleFieldChange = (field: keyof typeof editedClient, value: string) => {
    setEditedClient({ ...editedClient, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <ClientField
              label="First Name"
              value={client.firstName}
              field="firstName"
              isEditing={isEditing}
              editedValue={editedClient.firstName}
              onChange={(value) => handleFieldChange("firstName", value)}
            />
            <ClientField
              label="Last Name"
              value={client.lastName}
              field="lastName"
              isEditing={isEditing}
              editedValue={editedClient.lastName}
              onChange={(value) => handleFieldChange("lastName", value)}
            />
          </div>

          <ClientField
            label="Email"
            value={client.email}
            field="email"
            isEditing={isEditing}
            editedValue={editedClient.email}
            onChange={(value) => handleFieldChange("email", value)}
          />

          <div className="grid grid-cols-[120px_1fr] gap-2">
            <ClientField
              label="Phone Prefix"
              value={client.phonePrefix}
              field="phonePrefix"
              isEditing={isEditing}
              editedValue={editedClient.phonePrefix}
              onChange={(value) => handleFieldChange("phonePrefix", value)}
            />
            <ClientField
              label="Phone Number"
              value={client.phoneNumber}
              field="phoneNumber"
              isEditing={isEditing}
              editedValue={editedClient.phoneNumber}
              onChange={(value) => handleFieldChange("phoneNumber", value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ClientField
              label="Country"
              value={client.country}
              field="country"
              isEditing={isEditing}
              editedValue={editedClient.country}
              onChange={(value) => handleFieldChange("country", value)}
            />
            <ClientField
              label="City"
              value={client.city}
              field="city"
              isEditing={isEditing}
              editedValue={editedClient.city}
              onChange={(value) => handleFieldChange("city", value)}
            />
          </div>

          <ClientField
            label="Website"
            value={client.website}
            field="website"
            isEditing={isEditing}
            editedValue={editedClient.website}
            onChange={(value) => handleFieldChange("website", value)}
            isLink
          />
          <ClientField
            label="LinkedIn Profile"
            value={client.linkedin}
            field="linkedin"
            isEditing={isEditing}
            editedValue={editedClient.linkedin}
            onChange={(value) => handleFieldChange("linkedin", value)}
            isLink
          />

          <div className="grid grid-cols-2 gap-4">
            <ClientField
              label="Active Projects"
              value={client.activeProjects.toString()}
              field="activeProjects"
              isEditing={isEditing}
            />
            <ClientField
              label="Total Revenue"
              value={`$${client.totalRevenue.toLocaleString()}`}
              field="totalRevenue"
              isEditing={isEditing}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} variant="default">Save</Button>
                <Button onClick={() => {
                  setIsEditing(false);
                  setEditedClient(client);
                }} variant="outline">Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">Edit</Button>
            )}
          </div>
          <DeleteClientDialog onDelete={() => deleteMutation.mutate()} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;