import { Session } from "./session.interface";
import { Tenant, PrimaryTenant } from "./tenant.interface";
import { User, UserWithTenants } from "./user.interface";

export interface AuthResponse {
  user: User;
  session: Session;
  tenant?: Tenant;
  tenants?: Tenant[];
  primaryTenant?: PrimaryTenant;
}

export interface LoginResponse {
  user: User;
  session: Session;
  tenants: Tenant[];
  primaryTenant: PrimaryTenant;
}

export interface RegisterResponse {
  user: User;
  session: Session;
  tenant: Tenant;
  primaryTenant: PrimaryTenant;
}

export interface UserProfileResponse extends UserWithTenants {}

export interface CheckUserStatusResponse {
  email: string;
  tenantIdentifier: string;
  isAssignedToTenant: boolean;
  assignment?: {
    userId: string;
    tenantId: string;
    role: 'admin' | 'user';
    isActive: boolean;
  };
}

export interface JoinTenantResponse {
  message: string;
  tenant: {
    id: string;
    name: string;
    identifier: string;
  };
  instructions: string;
}

export interface MessageResponse {
  message: string;
  action?: string;
  email?: string;
}
