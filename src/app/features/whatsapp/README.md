# WhatsApp Bot Transactions

This module provides TypeScript interfaces and models for managing bot transactions in the SirisCloud WhatsApp integration system.

## Overview

The WhatsApp feature handles bot transactions for healthcare providers, storing transaction information including phone numbers, pricing, and provider relationships. This frontend module provides type-safe interfaces that correspond to the backend API endpoints.

## Database Schema

The bot transactions are stored in the `bot_transactions` table in the `transaction` schema with the following structure:

- `id` (UUID): Primary key
- `meta_phone_number_id` (VARCHAR): Meta phone number identifier
- `recipient_number` (VARCHAR): Recipient phone number
- `pricing_transaction` (DECIMAL): Transaction pricing amount
- `healthcare_provider_id` (UUID): Foreign key to healthcare_providers table
- `created_at` (TIMESTAMP): Creation timestamp

## Interfaces

### Core Interfaces

#### `BotTransaction`
Represents a complete bot transaction record:
```typescript
interface BotTransaction {
  id: string;                    // Primary key - UUID identifier
  metaPhoneNumberId: string;     // Meta phone number identifier
  recipientNumber: string;       // Recipient phone number
  pricingTransaction: number;     // Transaction pricing amount
  healthcareProviderId: string;   // Foreign key to healthcare_providers table
  createdAt: string;             // Creation timestamp
}
```

#### `BotTransactionStats`
Represents aggregated statistics for bot transactions:
```typescript
interface BotTransactionStats {
  totalTransactions: number;      // Total number of transactions
  totalAmount: number;           // Total transaction amount
  averageAmount: number;         // Average transaction amount
  healthcareProviderId: string;  // Healthcare provider ID
  dateRange?: {                  // Optional date range
    from: string;
    to: string;
  };
}
```

### DTO Interfaces

#### `CreateBotTransactionDto`
Data Transfer Object for creating new bot transactions:
```typescript
interface CreateBotTransactionDto {
  metaPhoneNumberId: string;     // Required
  recipientNumber: string;       // Required
  pricingTransaction: number;     // Required
  healthcareProviderId: string;  // Required
}
```

#### `UpdateBotTransactionDto`
Data Transfer Object for updating existing bot transactions (all fields optional):
```typescript
interface UpdateBotTransactionDto {
  metaPhoneNumberId?: string;    // Optional
  recipientNumber?: string;      // Optional
  pricingTransaction?: number;    // Optional
  healthcareProviderId?: string; // Optional
}
```

#### `BotTransactionQueryParams`
Query parameters for filtering and pagination:
```typescript
interface BotTransactionQueryParams {
  healthcareProviderId?: string; // Filter by healthcare provider
  page?: number;                 // Page number for pagination
  limit?: number;                // Items per page
  sortBy?: 'createdAt' | 'pricingTransaction' | 'recipientNumber';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;             // Date range filter - start
  dateTo?: string;               // Date range filter - end
}
```

## API Endpoints

The interfaces correspond to the following backend API endpoints:

### Bot Transactions
- `POST /bot-transactions` - Create a new bot transaction
- `GET /bot-transactions` - Get all bot transactions
- `GET /bot-transactions/:id` - Get a specific bot transaction
- `PATCH /bot-transactions/:id` - Update a bot transaction
- `DELETE /bot-transactions/:id` - Delete a bot transaction

### Healthcare Provider Specific
- `GET /bot-transactions/healthcare-provider/:healthcareProviderId` - Get transactions for a specific healthcare provider
- `GET /bot-transactions/stats?healthcareProviderId=:id` - Get transaction statistics

## Usage Examples

### Creating a New Bot Transaction
```typescript
import { CreateBotTransactionDto } from '@/features/whatsapp';

const newTransaction: CreateBotTransactionDto = {
  metaPhoneNumberId: 'meta_123',
  recipientNumber: '+1234567890',
  pricingTransaction: 25.50,
  healthcareProviderId: 'provider-uuid'
};

// Use with HTTP service
const transaction = await botTransactionsService.create(newTransaction);
```

### Updating an Existing Transaction
```typescript
import { UpdateBotTransactionDto } from '@/features/whatsapp';

const updateData: UpdateBotTransactionDto = {
  pricingTransaction: 30.00,
  recipientNumber: '+0987654321'
};

// Use with HTTP service
const updatedTransaction = await botTransactionsService.update(transactionId, updateData);
```

### Fetching Transactions with Filters
```typescript
import { BotTransactionQueryParams } from '@/features/whatsapp';

const queryParams: BotTransactionQueryParams = {
  healthcareProviderId: 'provider-uuid',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31'
};

// Use with HTTP service
const transactions = await botTransactionsService.getAll(queryParams);
```

### Getting Transaction Statistics
```typescript
import { BotTransactionStats } from '@/features/whatsapp';

// Use with HTTP service
const stats: BotTransactionStats = await botTransactionsService.getStats('provider-uuid');
console.log(`Total transactions: ${stats.totalTransactions}`);
console.log(`Total amount: $${stats.totalAmount}`);
console.log(`Average amount: $${stats.averageAmount}`);
```

## Authentication

All API endpoints require authentication via the SupabaseAuthGuard. Make sure to include proper authentication headers when making requests.

## Type Safety

These interfaces provide compile-time type safety when working with bot transaction data. They ensure that:

- Required fields are always provided when creating transactions
- Optional fields are properly handled when updating transactions
- Query parameters are correctly typed for API calls
- Response data matches expected structure

## Integration

To use these interfaces in your components or services:

1. Import the required interfaces:
```typescript
import { 
  BotTransaction, 
  CreateBotTransactionDto, 
  UpdateBotTransactionDto,
  BotTransactionStats,
  BotTransactionQueryParams 
} from '@/features/whatsapp';
```

2. Use them in your service methods:
```typescript
@Injectable()
export class BotTransactionService {
  async createTransaction(dto: CreateBotTransactionDto): Promise<BotTransaction> {
    // Implementation
  }
  
  async updateTransaction(id: string, dto: UpdateBotTransactionDto): Promise<BotTransaction> {
    // Implementation
  }
  
  async getTransactions(params?: BotTransactionQueryParams): Promise<BotTransaction[]> {
    // Implementation
  }
  
  async getStats(providerId: string): Promise<BotTransactionStats> {
    // Implementation
  }
}
```
