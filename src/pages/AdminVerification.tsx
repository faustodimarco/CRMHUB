import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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
import { Shield, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AdminVerification = () => {
  const { toast } = useToast();

  const { data: users = [], refetch } = useQuery({
    queryKey: ['unverified-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auth.users')
        .select('*')
        .eq('is_verified', false)
        .order('signup_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleVerify = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('auth.users')
        .update({ is_verified: true })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User verified",
        description: "The user has been successfully verified.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('auth.users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User rejected",
        description: "The user has been removed from the system.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold">User Verification</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Signed Up</TableHead>
              <TableHead>Auto-Delete In</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(user.signup_date), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(
                    new Date(new Date(user.signup_date).getTime() + 5 * 24 * 60 * 60 * 1000),
                    { addSuffix: true }
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(user.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No users pending verification
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminVerification;