import { createContext, useContext, useEffect, useState } from "react";
import { Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserData } from "@/hooks/useUserData";
import { AuthUser } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, fetchUserData } = useUserData();

  const handleSession = async (session: Session | null) => {
    try {
      if (session?.user) {
        const userData = await fetchUserData(session.user.id, session.user);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error handling session:', error);
      toast.error('Error handling session');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        await handleSession(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error('Error initializing authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      await handleSession(session);
      
      // Handle navigation based on auth state
      if (session) {
        if (location.pathname === '/login' || location.pathname === '/signup') {
          navigate('/');
        }
      } else {
        if (!['/login', '/signup'].includes(location.pathname)) {
          navigate('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data?.user) {
        throw new Error('No user data received');
      }

      const userData = await fetchUserData(data.user.id, data.user);
      
      if (!userData) {
        throw new Error('Failed to fetch user data');
      }

      setUser(userData);
      setSession(data.session);
      toast.success('Successfully signed in');
      navigate('/');
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error signing in:', authError);
      toast.error(authError.message || 'Error signing in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Please check your email to confirm your account');
      navigate('/login');
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error signing up:', authError);
      toast.error(authError.message || 'Error signing up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      navigate("/login");
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error signing out:', authError);
      toast.error(authError.message || 'Error signing out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};