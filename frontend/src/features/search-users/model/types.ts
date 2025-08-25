export interface User {
  id: string;
  steam_id: string;
  username: string;
  avatar: string;
  online: boolean;
  last_seen: string;
}

export interface UsersSearchResponse {
  users: User[];
  total: number;
}

export interface SearchUsersParams {
  query?: string;
  limit?: number;
  offset?: number;
}
