import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PendingUsersTable } from "@/components/admin/PendingUsersTable";
import { User } from "@/components/admin/types";
import { User as AuthUser } from '@supabase/supabase-js';

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pending users with their email addresses
  const { data: pendingUsers = [] } = useQuery<User[]>({
    queryKey: ['pending-users'],
    queryFn: async () => {
      // First, get unverified users from public.users table
      const { data: unverifiedUsers, error: unverifiedError } = await supabase
        .from('users')
        .select('id, created_at, is_verified')
        .eq('is_verified', false);

      if (unverifiedError) throw unverifiedError;

      // Then get the corresponding auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin
        .listUsers();

      if (authError) throw authError;

      // Combine the data
      return unverifiedUsers?.map(user => {
        const authUser = authUsers?.users?.find((au: AuthUser) => au.id === user.id);
        return {
          id: user.id,
          created_at: user.created_at,
          is_verified: user.is_verified,
          email: authUser?.email || 'No email available'
        };
      }) || [];
    },
  });

  // Accept user mutation
  const acceptUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .update({ is_verified: true })
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
        .from('users')
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

  // Check if current user is admin
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">User Management</h1>
            <p className="text-muted-foreground">Accept or refuse new user registrations</p>
          </div>
        </div>

        <PendingUsersTable
          pendingUsers={pendingUsers}
          onAccept={(userId) => acceptUserMutation.mutate(userId)}
          onRefuse={(userId) => refuseUserMutation.mutate(userId)}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default Admin;