import { User } from "@supabase/supabase-js";
import { AuthUser } from "@/types/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const mapUserToAuthUser = (user: User, userData: any): AuthUser => {
  if (!user.email) {
    throw new Error('User email is required');
  }
  
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    is_verified: userData?.is_verified || false,
    is_admin: userData?.is_admin || false,
  };
};

export const fetchUserData = async (userId: string) => {
  try {
    console.log('Fetching user data for ID:', userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }

    console.log('User data fetched:', data);
    return data;
  } catch (error) {
    console.error('Error managing user data:', error);
    toast.error('Error fetching user data');
    return null;
  }
};