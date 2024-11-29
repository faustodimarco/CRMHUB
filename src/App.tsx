import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import WaitingApproval from "@/components/auth/WaitingApproval";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings as SettingsIcon, LogOut, User, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient();

export function UserNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full ring-1 ring-border/50 hover:ring-primary/30 transition-all duration-200"
        >
          <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-105">
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
              {user?.email ? getInitials(user.email) : ''}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 p-2" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg glass-card"
        >
          <User className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex flex-col space-y-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Manage your account</p>
          </div>
        </motion.div>
        <DropdownMenuSeparator className="my-2 opacity-10" />
        <DropdownMenuItem 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 p-2 cursor-pointer rounded-md hover:bg-secondary/50 transition-colors duration-200"
        >
          <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 p-2 cursor-pointer rounded-md hover:bg-secondary/50 transition-colors duration-200"
        >
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>Admin Panel</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2 opacity-10" />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="flex items-center gap-2 p-2 cursor-pointer rounded-md text-destructive hover:bg-destructive/10 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ['user-verification', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('users')
        .select('is_verified, verification_status')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Show loading screen while checking auth state or fetching user data
  if (loading || isUserDataLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show waiting screen for unverified users, except for admin page which has its own checks
  if (userData && !userData.is_verified && window.location.pathname !== '/admin') {
    return <WaitingApproval />;
  }

  return children;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/dashboard" element={<Navigate to="/" replace />} />
    <Route path="/clients" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/tasks" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/finances" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/invoices" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
