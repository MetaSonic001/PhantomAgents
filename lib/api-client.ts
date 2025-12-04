const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: any
}

export async function apiCall<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body } = options

  const url = `${BASE_URL}/api${endpoint}`

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body)
  }

  const response = await fetch(url, fetchOptions)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

// Agent endpoints
export const agentApi = {
  getAll: () => apiCall("/agents"),
  getById: (id: string) => apiCall(`/agents/${id}`),
  create: (data: any) => apiCall("/agents/create", { method: "POST", body: data }),
  register: (id: string) => apiCall(`/agents/${id}/register`, { method: "POST" }),
  update: (id: string, data: any) => apiCall(`/agents/${id}`, { method: "PUT", body: data }),
  delete: (id: string) => apiCall(`/agents/${id}`, { method: "DELETE" }),
}

// Marketplace endpoints
export const marketplaceApi = {
  getAll: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params || {}).toString()
    return apiCall(`/marketplace/agents${query ? "?" + query : ""}`)
  },
  getById: (id: string) => apiCall(`/marketplace/${id}`),
  list: (agent_id: string, price: number) => apiCall(`/marketplace/list`, { method: "POST", body: { agent_id, price } }),
  subscribe: (agent_id: string) => apiCall(`/marketplace/subscribe`, { method: "POST", body: { agent_id } }),
}

// Competitions endpoints
export const competitionsApi = {
  getAll: () => apiCall("/competitions"),
  create: (data: any) => apiCall("/competitions", { method: "POST", body: data }),
}

// Analytics endpoints
export const analyticsApi = {
  getMetrics: (period?: string) => {
    const query = new URLSearchParams(period ? { period } : {}).toString()
    return apiCall(`/analytics${query ? "?" + query : ""}`)
  },
}

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) => apiCall("/auth/login", { method: "POST", body: { email, password } }),
  signup: (email: string, password: string, name: string) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: { email, password, name },
    }),
}
