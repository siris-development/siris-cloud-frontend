import { User } from "./user.interface";

export interface Session {
    access_token:  string;
    token_type:    string;
    expires_in:    number;
    expires_at:    number;
    refresh_token: string;
    user:          User;
}
