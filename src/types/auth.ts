import { User, Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  is_verified: boolean;
  is_admin: boolean;
}

export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}