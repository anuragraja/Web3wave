import api from "../axios";
import { ApiResponse, User } from "../auth/types";
import { PaginationInfo } from "../events/types";

export interface DashboardOverviewData {
  events: {
    total: number;
    published: number;
    draft: number;
    completed: number;
    cancelled: number;
    byCategory: Record<string, number>;
  };
  users: {
    total: number;
    verified: number;
    unverified: number;
    admins: number;
    regularUsers: number;
  };
  companies?: {
    total: number;
    verified: number;
  };
  recentEvents: any[];
  recentUsers: any[];
}

export interface AdminCompany {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCompaniesResponse {
  success: boolean;
  message?: string;
  data: AdminCompany[];
  pagination?: PaginationInfo;
}

export interface PaginatedUsersResponse {
  success: boolean;
  message?: string;
  data: User[];
  pagination?: PaginationInfo;
}

export async function getAdminDashboardOverviewApi(): Promise<ApiResponse<DashboardOverviewData>> {
  const response = await api.get("/admin/dashboard");
  return response.data;
}

export async function getAdminUsersApi(query: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedUsersResponse> {
  const params = new URLSearchParams();
  if (query.page) params.append("page", query.page.toString());
  if (query.limit) params.append("limit", query.limit.toString());
  if (query.search) params.append("search", query.search);

  const response = await api.get(`/admin/users?${params.toString()}`);
  return response.data;
}

export async function getAdminCompaniesApi(query: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedCompaniesResponse> {
  const params = new URLSearchParams();
  if (query.page) params.append("page", query.page.toString());
  if (query.limit) params.append("limit", query.limit.toString());
  if (query.search) params.append("search", query.search);

  const response = await api.get(`/admin/companies?${params.toString()}`);
  return response.data;
}

export async function updateAdminUserRoleApi(id: string, roleName: string): Promise<ApiResponse<User>> {
  const response = await api.patch(`/admin/users/${id}/role`, { roleName });
  return response.data;
}

export async function deleteAdminUserApi(id: string): Promise<ApiResponse> {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
}
