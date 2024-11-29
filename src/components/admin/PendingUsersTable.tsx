import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, Trash2, RotateCcw } from "lucide-react";
import { User } from "./types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PendingUsersTableProps {
  pendingUsers: User[];
  onAccept: (userId: string) => void;
  onRefuse: (userId: string) => void;
  onDelete: (userId: string) => void;
  onRevert: (userId: string) => void;
  isLoading: boolean;
}

export function PendingUsersTable({ 
  pendingUsers, 
  onAccept, 
  onRefuse,
  onDelete,
  onRevert,
  isLoading 
}: PendingUsersTableProps) {
  const getStatusBadge = (status: User['verification_status']) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'refused':
        return <Badge variant="destructive">Refused</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Registered At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : 'No name provided'}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{getStatusBadge(user.verification_status)}</TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {user.verification_status === 'pending' && (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onAccept(user.id)}
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Accept user registration</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onRefuse(user.id)}
                            disabled={isLoading}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Refuse
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refuse user registration</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}

                {user.verification_status !== 'pending' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRevert(user.id)}
                          disabled={isLoading}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Revert
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Revert to pending status</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(user.id)}
                        disabled={isLoading}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete user account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {pendingUsers.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No pending user registrations
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}