export interface User {
  id: string;
  email: string;
  created_at: string;
  is_verified: boolean;
  first_name: string | null;
  last_name: string | null;
  verification_status: 'pending' | 'accepted' | 'refused';
  verified_at: string | null;
  verified_by: string | null;
  verification_notes: string | null;
}