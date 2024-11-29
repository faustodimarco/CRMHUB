import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const WaitingApproval = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Waiting for Approval</h1>
          <p className="text-muted-foreground">
            Your account is currently pending approval from an administrator. 
            You'll be able to access the CRM once your account has been verified.
          </p>
          <Button 
            variant="outline" 
            onClick={() => signOut()}
            className="mt-4"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaitingApproval;