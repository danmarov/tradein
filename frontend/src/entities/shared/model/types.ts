// src/entities/shared/model/types.ts

// Общие типы для API ответов
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Пагинация
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Базовые сущности
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// Общие перечисления
export type SortOrder = "asc" | "desc";

// Общие утилитарные типы
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
