export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'pending' | 'paid';
  file_path: string;
  created_at: string;
  user_id: string;
}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  is_verified: boolean;
  is_admin?: boolean;
}