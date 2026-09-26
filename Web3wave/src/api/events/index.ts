import api from "../axios";
import {
  BackendEvent,
  CreateEventPayload,
  UpdateEventPayload,
  GetEventsQuery,
  PaginatedEventsResponse,
  SingleEventResponse,
} from "./types";
import { ApiResponse } from "../auth/types";

// Public Event APIs
export async function getPublicEventsApi(
  query: GetEventsQuery = {}
): Promise<PaginatedEventsResponse> {
  const params = new URLSearchParams();
  if (query.page) params.append("page", query.page.toString());
  if (query.limit) params.append("limit", query.limit.toString());
  if (query.category) params.append("category", query.category);
  if (query.search) params.append("search", query.search);

  const response = await api.get(`/events?${params.toString()}`);
  return response.data;
}

export async function getPublicEventBySlugOrIdApi(
  slugOrId: string
): Promise<SingleEventResponse> {
  const response = await api.get(`/events/${slugOrId}`);
  return response.data;
}

// Admin Event APIs
export async function getAdminEventsApi(
  query: GetEventsQuery = {}
): Promise<PaginatedEventsResponse> {
  const params = new URLSearchParams();
  if (query.page) params.append("page", query.page.toString());
  if (query.limit) params.append("limit", query.limit.toString());
  if (query.category) params.append("category", query.category);
  if (query.status) params.append("status", query.status);
  if (query.search) params.append("search", query.search);

  const response = await api.get(`/admin/events?${params.toString()}`);
  return response.data;
}

export async function getEventByIdApi(id: string): Promise<SingleEventResponse> {
  const response = await api.get(`/admin/events/${id}`);
  return response.data;
}

export async function createEventApi(
  payload: CreateEventPayload
): Promise<SingleEventResponse> {
  const response = await api.post("/admin/events", payload);
  return response.data;
}

export async function updateEventApi(
  id: string,
  payload: UpdateEventPayload
): Promise<SingleEventResponse> {
  const response = await api.patch(`/admin/events/${id}`, payload);
  return response.data;
}

export async function deleteEventApi(id: string): Promise<ApiResponse> {
  const response = await api.delete(`/admin/events/${id}`);
  return response.data;
}

export async function publishEventApi(id: string): Promise<SingleEventResponse> {
  const response = await api.patch(`/admin/events/${id}/publish`);
  return response.data;
}

export async function unpublishEventApi(id: string): Promise<SingleEventResponse> {
  const response = await api.patch(`/admin/events/${id}/unpublish`);
  return response.data;
}

// Subscription & Event Registration APIs
export async function subscribeEmailApi(email: string, frequency: string = "Every New Event") {
  const response = await api.post("/subscribers", { email, frequency });
  return response.data;
}

export async function registerForEventApi(eventId: string, payload: { name: string; email: string; role?: string }) {
  const response = await api.post(`/events/${eventId}/register`, payload);
  return response.data;
}

export async function getEventRegistrationStatusApi(eventId: string, email?: string) {
  const params = email ? `?email=${encodeURIComponent(email)}` : "";
  const response = await api.get(`/events/${eventId}/registration-status${params}`);
  return response.data;
}

