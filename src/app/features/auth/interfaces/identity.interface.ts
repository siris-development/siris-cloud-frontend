import { UserMetadata } from "./user-metadata.interface";

export interface Identity {
    identity_id:     string;
    id:              string;
    user_id:         string;
    identity_data:   UserMetadata;
    provider:        string;
    last_sign_in_at: Date;
    created_at:      Date;
    updated_at:      Date;
    email:           string;
}