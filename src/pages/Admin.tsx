import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCheck, UserX, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pending users
  const { data: pendingUsers = [] } = useQuery({
    queryKey: ['pending-users'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('auth.users')
        .select('*')
        .eq('confirmed_at', null);
      
      if (error) throw error;
      return users;
    },
  });

  // Accept user mutation
  const acceptUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('auth.users')
        .update({ confirmed_at: new Date().toISOString() })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      toast({
        title: "User accepted",
        description: "The user can now access the platform",
      });
    },
  });

  // Refuse user mutation
  const refuseUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('auth.users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      toast({
        title: "User refused",
        description: "The user has been removed from the platform",
      });
    },
  });

  // Check if current user is admin with improved error handling
  const { data: isAdmin, isError, error: adminError } = useQuery({
    queryKey: ['is-admin'],
    queryFn: async () => {
      console.log('Checking admin status for user:', user?.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      console.log('Admin check result:', data);
      return data?.is_admin || false;
    },
  });

  // Show error toast if admin check fails
  if (isError && adminError) {
    toast({
      title: "Error checking admin status",
      description: "Please try again later",
      variant: "destructive",
    });
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Shield className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">User Management</h1>
            <p className="text-muted-foreground">Accept or refuse new user registrations</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Registered At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.map((pendingUser) => (
              <TableRow key={pendingUser.id}>
                <TableCell>{pendingUser.email}</TableCell>
                <TableCell>{new Date(pendingUser.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acceptUserMutation.mutate(pendingUser.id)}
                      disabled={isLoading}
                      className="text-green-600 hover:text-green-700"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refuseUserMutation.mutate(pendingUser.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700"
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
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No pending user registrations
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Admin;