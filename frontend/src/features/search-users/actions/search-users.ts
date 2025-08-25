import type { UsersSearchResponse, SearchUsersParams } from "../model/types";

export const searchUsers = async ({
  query,
  limit = 15,
  offset = 0,
}: SearchUsersParams = {}): Promise<UsersSearchResponse> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (query?.trim()) {
    params.set("q", query.trim());
  }

  const response = await fetch(`/api/users/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to search users: ${response.statusText}`);
  }

  return response.json();
};
