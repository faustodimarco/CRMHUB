import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";
import { User } from "./types";

interface PendingUsersTableProps {
  pendingUsers: User[];
  onAccept: (userId: string) => void;
  onRefuse: (userId: string) => void;
  isLoading: boolean;
}

export function PendingUsersTable({ 
  pendingUsers, 
  onAccept, 
  onRefuse, 
  isLoading 
}: PendingUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Registered At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingUsers.map((pendingUser) => (
          <TableRow key={pendingUser.id}>
            <TableCell>
              {pendingUser.first_name && pendingUser.last_name 
                ? `${pendingUser.first_name} ${pendingUser.last_name}`
                : 'No name provided'}
            </TableCell>
            <TableCell>{pendingUser.email}</TableCell>
            <TableCell>{new Date(pendingUser.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAccept(pendingUser.id)}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRefuse(pendingUser.id)}
                  disabled={isLoading}
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Refuse
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {pendingUsers.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              No pending user registrations
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}