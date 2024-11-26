import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient, deleteClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const renderField = (label: string, value: string, field: keyof typeof editedClient) => {
    if (isEditing && !['activeProjects', 'totalRevenue'].includes(field)) {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input
            value={editedClient[field]}
            onChange={(e) => setEditedClient({ ...editedClient, [field]: e.target.value })}
            className="w-full"
          />
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="p-2 bg-secondary rounded-md">
          {field === 'website' || field === 'linkedin' ? (
            value ? (
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {value}
              </a>
            ) : (
              "Not provided"
            )
          ) : (
            value
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {renderField("First Name", client.firstName, "firstName")}
            {renderField("Last Name", client.lastName, "lastName")}
          </div>

          {renderField("Email", client.email, "email")}

          <div className="grid grid-cols-[120px_1fr] gap-2">
            {renderField("Phone Prefix", client.phonePrefix, "phonePrefix")}
            {renderField("Phone Number", client.phoneNumber, "phoneNumber")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderField("Country", client.country, "country")}
            {renderField("City", client.city, "city")}
          </div>

          {renderField("Website", client.website, "website")}
          {renderField("LinkedIn Profile", client.linkedin, "linkedin")}

          <div className="grid grid-cols-2 gap-4">
            {renderField("Active Projects", client.activeProjects.toString(), "activeProjects")}
            {renderField("Total Revenue", `$${client.totalRevenue.toLocaleString()}`, "totalRevenue")}
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Client</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the client
                  and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;