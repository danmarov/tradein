import type { BaseEntity, PaginationParams } from "@/entities/shared/model";

export interface User extends BaseEntity {
  steam_id: string;
  username: string;
  avatar: string;
  balance: number;
  online: boolean;
  last_seen: string;
}

export interface UserProfile extends User {
  email?: string;
  settings?: UserSettings;
  stats?: UserStats;
}

export interface UserSettings {
  notifications: boolean;
  trade_confirmations: boolean;
}

export interface UserStats {
  total_trades: number;
  successful_trades: number;
  items_count: number;
}

export interface UserBrief {
  id: string;
  username: string;
  avatar: string;
}

export interface UserSearchParams extends PaginationParams {}

export interface UserSearchResponse {
  users: User[];
  total: number;
}

export interface UpdateUserProfileData {
  username?: string;
  email?: string;
  settings?: Partial<UserSettings>;
}
