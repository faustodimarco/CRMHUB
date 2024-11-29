import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AdminAccessDenied() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Shield className="w-12 h-12 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
      <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
    </div>
  );
}