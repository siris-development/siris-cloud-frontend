/**
 * Create Bot Transaction DTO Interface
 * 
 * Data Transfer Object for creating new bot transactions.
 * All fields are required when creating a new transaction.
 */
export interface CreateBotTransactionDto {
  /** Meta phone number identifier */
  metaPhoneNumberId: string;
  
  /** Recipient phone number */
  recipientNumber: string;
  
  /** Transaction pricing amount */
  pricingTransaction: number;
  
  /** Foreign key to healthcare_providers table */
  healthcareProviderId: string;
}

/**
 * Update Bot Transaction DTO Interface
 * 
 * Data Transfer Object for updating existing bot transactions.
 * All fields are optional as partial updates are supported.
 */
export interface UpdateBotTransactionDto {
  /** Meta phone number identifier */
  metaPhoneNumberId?: string;
  
  /** Recipient phone number */
  recipientNumber?: string;
  
  /** Transaction pricing amount */
  pricingTransaction?: number;
  
  /** Foreign key to healthcare_providers table */
  healthcareProviderId?: string;
}

/**
 * Bot Transaction Query Parameters Interface
 * 
 * Interface for query parameters when fetching bot transactions
 */
export interface BotTransactionQueryParams {
  /** Filter by healthcare provider ID */
  healthcareProviderId?: string;
  
  /** Page number for pagination */
  page?: number;
  
  /** Number of items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: 'createdAt' | 'pricingTransaction' | 'recipientNumber';
  
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
  
  /** Date range filter - start date */
  dateFrom?: string;
  
  /** Date range filter - end date */
  dateTo?: string;
}
