import { AppMetadata } from "./app-metadata.interface";
import { Identity } from "./identity.interface";
import { UserMetadata } from "./user-metadata.interface";

export interface User {
    id:                   string;
    aud:                  string;
    role:                 string;
    email:                string;
    email_confirmed_at:   Date;
    phone:                string;
    confirmation_sent_at: Date;
    confirmed_at:         Date;
    recovery_sent_at:     Date;
    last_sign_in_at:      Date;
    app_metadata:         AppMetadata;
    user_metadata:        UserMetadata;
    identities:           Identity[];
    created_at:           Date;
    updated_at:           Date;
    is_anonymous:         boolean;
}

