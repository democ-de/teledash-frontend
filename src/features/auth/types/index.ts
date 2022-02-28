export type AuthAccount = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  clients: null | string[];
  created_at: Date;
  updated_at: Date;
};
