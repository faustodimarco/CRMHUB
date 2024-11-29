import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthUser } from '@/types';

export const useUserData = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchUserData = async (userId: string, sessionUser: User) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('is_admin, is_verified')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return await createNewUser(userId, sessionUser);
        }
        console.error('Error fetching user data:', error);
        return null;
      }

      return {
        ...sessionUser,
        is_admin: userData.is_admin,
        is_verified: userData.is_verified,
      } as AuthUser;
    } catch (error) {
      console.error('Error managing user data:', error);
      return null;
    }
  };

  const createNewUser = async (userId: string, sessionUser: User) => {
    try {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            id: userId,
            is_admin: false,
            is_verified: false
          }
        ])
        .select('is_admin, is_verified')
        .single();

      if (insertError) {
        console.error('Error creating user data:', insertError);
        return null;
      }

      return {
        ...sessionUser,
        is_admin: newUser.is_admin,
        is_verified: newUser.is_verified,
      } as AuthUser;
    } catch (error) {
      console.error('Error creating new user:', error);
      return null;
    }
  };

  return {
    user,
    setUser,
    fetchUserData,
  };
};