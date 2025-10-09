/**
 * Bot Transaction Interface
 * 
 * Represents a bot transaction record in the SirisCloud system.
 * This interface maps to the bot_transactions table in the transaction schema.
 */
export interface BotTransaction {
  /** Primary key - UUID identifier */
  id: string;
  
  /** Meta phone number identifier */
  metaPhoneNumberId: string;
  
  /** Recipient phone number */
  recipientNumber: string;
  
  /** Transaction pricing amount */
  pricingTransaction: number;
  
  /** Foreign key to healthcare_providers table */
  healthcareProviderId: string;
  
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Bot Transaction Statistics Interface
 * 
 * Represents aggregated statistics for bot transactions
 * for a specific healthcare provider.
 */
export interface BotTransactionStats {
  /** Total number of transactions */
  totalTransactions: number;
  
  /** Total transaction amount */
  totalAmount: number;
  
  /** Average transaction amount */
  averageAmount: number;
  
  /** Healthcare provider ID these stats belong to */
  healthcareProviderId: string;
  
  /** Date range for these statistics */
  dateRange?: {
    from: string;
    to: string;
  };
}
