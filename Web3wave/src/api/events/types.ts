export interface BackendEvent {
  _id: string;
  title: string;
  slug: string;
  category: "WORKSHOP" | "HACKATHON" | "MEETUP" | "GRANT_SPRINT" | string;
  description: string;
  capacity: number;
  date: string; // ISO 8601 date string
  startTime: string;
  endTime?: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone?: string;
  poster?: string;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED" | string;
  createdBy?: any;
  updatedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventPayload {
  title: string;
  category: string;
  description: string;
  capacity: number;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone?: string;
  poster?: string;
  status?: string;
}

export interface UpdateEventPayload {
  title?: string;
  category?: string;
  description?: string;
  capacity?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  poster?: string;
  status?: string;
}

export interface GetEventsQuery {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedEventsResponse {
  success: boolean;
  message?: string;
  data: BackendEvent[];
  pagination?: PaginationInfo;
}

export interface SingleEventResponse {
  success: boolean;
  message?: string;
  data: BackendEvent;
}
