import { Session } from "./session.interface";
import { Tenant } from "./tenant.interface";
import { User } from "./user.interface";

export interface SupabaseAuthResponse {
    user:    User;
    session: Session;
    tenant:  Tenant;
}
