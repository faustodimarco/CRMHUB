import { User } from "@/components/admin/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Shield } from "lucide-react";

interface AdminPermissionsTableProps {
  users: User[];
}

export function AdminPermissionsTable({ users }: AdminPermissionsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: isAdmin })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, { isAdmin }) => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      toast({
        title: `Admin permissions ${isAdmin ? 'granted' : 'revoked'}`,
        description: `The user's admin status has been updated`,
      });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Admin Permissions</h3>
      </div>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Admin Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{user.email}</span>
                    <span className="text-sm text-muted-foreground">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  {user.is_admin ? (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Shield className="h-4 w-4" />
                      Admin
                    </span>
                  ) : (
                    <span className="text-muted-foreground">User</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <Button
                    variant={user.is_admin ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => toggleAdminMutation.mutate({ 
                      userId: user.id, 
                      isAdmin: !user.is_admin 
                    })}
                  >
                    {user.is_admin ? "Remove Admin" : "Make Admin"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}