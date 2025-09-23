import { Tenant, PrimaryTenant } from './tenant.interface';

export interface User {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  tenants?: Tenant[];
}

export interface UserWithTenants extends User {
  tenants: Tenant[];
  primaryTenant?: PrimaryTenant;
}

