import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types';
import { toast } from 'sonner';

interface UserData {
  is_admin: boolean;
  is_verified: boolean;
}

export const useUserData = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchUserData = async (userId: string, sessionUser: User): Promise<AuthUser | null> => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('is_admin, is_verified')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        
        if (error.code === 'PGRST116') {
          const { data: newUserData, error: insertError } = await supabase
            .from('users')
            .insert([{ 
              id: userId,
              is_admin: false,
              is_verified: false
            }])
            .select('is_admin, is_verified')
            .single();

          if (insertError) {
            console.error('Error creating user data:', insertError);
            toast.error('Error creating user data');
            return null;
          }

          return {
            ...sessionUser,
            is_admin: newUserData?.is_admin || false,
            is_verified: newUserData?.is_verified || false,
          } as AuthUser;
        }
        
        toast.error('Error fetching user data');
        return null;
      }

      return {
        ...sessionUser,
        is_admin: userData?.is_admin || false,
        is_verified: userData?.is_verified || false,
      } as AuthUser;
    } catch (error) {
      console.error('Error managing user data:', error);
      toast.error('Error managing user data');
      return null;
    }
  };

  return {
    user,
    setUser,
    fetchUserData,
  };
};