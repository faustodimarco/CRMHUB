export interface User {
  id: string;
  email: string;
  created_at: string;
  is_verified: boolean;
  first_name: string | null;
  last_name: string | null;
}