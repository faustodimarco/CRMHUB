import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, Sun, Moon, Lock, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteCompletedTasks } from "@/services/taskService";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user } = useAuth();

  const deleteCompletedTasksMutation = useMutation({
    mutationFn: deleteCompletedTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: "Completed tasks deleted successfully" });
    },
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Password change logic would go here
    toast({ title: "Password changed successfully" });
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[800px] mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="border border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Manage your tasks and cleanup options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Delete Completed Tasks</Label>
                  <div className="text-sm text-muted-foreground">
                    Remove all tasks marked as done
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteCompletedTasksMutation.mutate()}
                  disabled={deleteCompletedTasksMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Update your password and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;