export interface Tier {
  id: string;
  name: string;
  price: number;
  usageLimit: number;
  description?: string;
  isActive: boolean;
  features?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateTierDto {
  name?: string;
  price?: number;
  usageLimit?: number;
  description?: string;
  isActive?: boolean;
  features?: Record<string, any>;
}

export interface UpdateTierDto {
  name?: string;
  price?: number;
  usageLimit?: number;
  description?: string;
  isActive?: boolean;
  features?: Record<string, any>;
}

export interface TierQueryDto {
  isActive?: boolean;
  search?: string;
}

export interface TierStats {
  totalTiers: number;
  activeTiers: number;
  totalRevenue: number;
  averagePrice: number;
}
