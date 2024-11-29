import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PendingUsersTable } from "@/components/admin/PendingUsersTable";
import { AdminPermissionsTable } from "@/components/admin/AdminPermissionsTable";
import { User } from "@/components/admin/types";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading] = useState(false);

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

  const { data: isAdmin } = useQuery({
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

  if (!isAdmin) {
    return <AdminAccessDenied />;
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

      <div className="space-y-6">
        <Card className="p-6">
          <PendingUsersTable
            pendingUsers={users}
            isLoading={isLoading}
          />
        </Card>

        <Card className="p-6">
          <AdminPermissionsTable users={users} />
        </Card>
      </div>
    </div>
  );
};

export default Admin;