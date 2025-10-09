/**
 * Usage Query Parameters Interface
 * 
 * Interface for query parameters when fetching usage data from Analytics API
 */
export interface UsageQueryParams {
  /** Healthcare provider ID to filter by */
  healthcareProviderId: string;
  
  /** Start date for filtering (YYYY-MM-DD format) */
  startDate: string;
  
  /** End date for filtering (YYYY-MM-DD format) */
  endDate: string;
  
  /** Group results by 'day', 'week', or 'month' */
  groupBy: 'day' | 'week' | 'month';

  /** Project ID to filter by */
  projectId: string;

  /** API Key ID to filter by */
  apiKeyId: string;
}

/**
 * OpenAI Budget Configuration Interface
 * 
 * Interface for budget settings based on OpenAI Usage API
 */
export interface BudgetConfig {
  /** Budget amount in USD */
  amount: number;
  
  /** Budget period */
  period: 'monthly' | 'yearly' | 'custom';
  
  /** Custom period start date (if period is custom) */
  customStartDate?: string;
  
  /** Budget reset day of month (for monthly budgets) */
  resetDay?: number;
  
  /** Alert thresholds */
  alerts: {
    /** Percentage threshold for warning (e.g., 80 for 80%) */
    warningThreshold: number;
    
    /** Percentage threshold for critical alert (e.g., 95 for 95%) */
    criticalThreshold: number;
  };
  
  /** Model-specific budget limits */
  modelLimits?: {
    [model: string]: {
      /** Budget limit for this model */
      limit: number;
      
      /** Alert thresholds for this model */
      alerts: {
        warningThreshold: number;
        criticalThreshold: number;
      };
    };
  };
  
  /** Request type limits */
  requestTypeLimits?: {
    [requestType: string]: {
      /** Budget limit for this request type */
      limit: number;
      
      /** Alert thresholds for this request type */
      alerts: {
        warningThreshold: number;
        criticalThreshold: number;
      };
    };
  };
  
  /** Healthcare provider ID */
  healthcareProviderId?: string;
}

/**
 * OpenAI Completions Usage Object Interface
 * Based on OpenAI API response structure
 */
export interface OpenAIUsage {
  totalInputTokens: number;
  totalRequests: number;
}

/**
 * OpenAI Usage Result Interface
 */
export interface OpenAIUsageResult {
  object: string;
  input_tokens: number;
  output_tokens: number;
  input_cached_tokens: number;
  input_audio_tokens: number;
  output_audio_tokens: number;
  num_model_requests: number;
  project_id: string | null;
  user_id: string | null;
  api_key_id: string | null;
  model: string | null;
  batch: string | null;
}

/**
 * OpenAI Usage Bucket Interface
 */
export interface OpenAIUsageBucket {
  object: string;
  start_time: number;
  end_time: number;
  results: OpenAIUsageResult[];
}

/**
 * OpenAI Usage Page Interface
 */
export interface OpenAIUsagePage {
  object: string;
  data: OpenAIUsageBucket[];
  has_more: boolean;
  next_page: string;
}

/**
 * Chat Completions by Period Interface
 */
export interface ChatCompletionsByPeriod {
  /** Period identifier (YYYY-MM-DD, YYYY-W##, or YYYY-MM) */
  period: string;
  
  /** Number of chat completions for this period */
  completions: number;
  
  /** OpenAI usage object for this period */
  usage: OpenAIUsage;
  
  /** Legacy fields for backward compatibility */
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

/**
 * Tier Breakdown Interface
 */
export interface TierBreakdown {
  /** Tier name */
  tierName: string;
  
  /** Total usage for this tier */
  totalUsage: number;
  
  /** Total requests for this tier */
  totalRequests: number;
}

/**
 * Budget Status Response Interface
 * 
 * Response from GET /bot-transactions/analytics/budget/:healthcareProviderId
 */
export interface BudgetResponse {
  /** Monthly budget limit */
  budget: number;
  
  /** Budget used amount */
  budgetUsed: number;
  
  /** Budget remaining amount */
  budgetRemaining: number;
  
  /** Days until budget reset */
  daysUntilReset: number;
  
  /** Date when budget resets */
  resetDate: string;
}

/**
 * Budget Update Response Interface
 * 
 * Response from PUT /bot-transactions/analytics/budget/:healthcareProviderId
 */
export interface BudgetUpdateResponse {
  /** Success status */
  success: boolean;
  
  /** Response message */
  message: string;
  
  /** Healthcare provider ID */
  healthcareProviderId: string;
  
  /** New budget amount */
  newBudget: number;
  
  /** Subscription ID */
  subscriptionId: string;
}


/**
 * Budget Update Request Interface
*/
export interface BudgetUpdateRequest {
 
  /** Healthcare provider ID */
  healthcareProviderId: string;
  
  /** New monthly budget amount */
  budget: number;
  
  /** Subscription ID */
  subscriptionId: string;
}

/**
 * Budget Alert Create Request Interface
*/
export interface BudgetThresholdUpdateRequest {
  
  /** Healthcare provider ID */
  healthcareProviderId: string;
  
  /** Alert threshold percentage */
  threshold: number;
  
  /** Email subject prefix */
  emailSubject?: string;
}

/**
 * Budget Alert Interface
 */
export interface BudgetThresholdUpdateResponse {
  /** Success status */
  success: boolean;

  /** Response message */
  message: string;
  
  /** Healthcare provider ID */
  healthcareProviderId: string;
  
  /** Budget threshold amount */
  budgetThreshold: number;
  
  /** Subscription ID */
  subscriptionId: string;
}
