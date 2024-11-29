import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PendingUsersTable } from "@/components/admin/PendingUsersTable";
import { User } from "@/components/admin/types";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users-management'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return users;
    },
  });

  const acceptUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .update({ 
          verification_status: 'accepted',
        })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      toast({
        title: "User accepted",
        description: "The user can now access the platform",
      });
    },
  });

  const refuseUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .update({ 
          verification_status: 'refused',
        })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      toast({
        title: "User refused",
        description: "The user has been refused access to the platform",
      });
    },
  });

  const revertStatusMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .update({ 
          verification_status: 'pending',
          is_verified: false,
          verified_at: null,
          verified_by: null
        })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      toast({
        title: "Status reverted",
        description: "User status has been reset to pending",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc('delete_user', {
        user_id: userId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      toast({
        title: "User deleted",
        description: "The user account has been permanently deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting user",
        description: "There was an error deleting the user. Please try again.",
        variant: "destructive",
      });
      console.error('Error deleting user:', error);
    },
  });

  const { data: isAdmin, isError, error: adminError } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data?.is_admin || false;
    },
    enabled: !!user?.id,
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">User Management</h2>
            <p className="text-muted-foreground">Manage user registrations and access</p>
          </div>
        </div>

        <PendingUsersTable
          pendingUsers={users}
          onAccept={(userId) => acceptUserMutation.mutate(userId)}
          onRefuse={(userId) => refuseUserMutation.mutate(userId)}
          onDelete={(userId) => deleteUserMutation.mutate(userId)}
          onRevert={(userId) => revertStatusMutation.mutate(userId)}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default Admin;
