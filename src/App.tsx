import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
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
        className="w-64 p-2" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg glass-card"
        >
          <User className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.email}</p>
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
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