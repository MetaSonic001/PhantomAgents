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

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`
      try {
        const error = await response.json()
        errorMessage = error.detail || error.error || error.message || errorMessage
      } catch (e) {
        // If response isn't JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error: Unable to reach the server")
  }
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
  getAgentAnalytics: async (agentId: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    const response = await fetch(`${BASE_URL}/analytics/agent/${agentId}`)
    if (!response.ok) throw new Error("Failed to fetch agent analytics")
    return response.json()
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

// Demo/Simulation endpoints
export const demoApi = {
  addRevenue: async (agentId: string, amount: number) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    const response = await fetch(`${BASE_URL}/demo/add-revenue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, amount }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to add revenue")
    }
    return response.json()
  },
  simulateAction: async (agentId: string, actionType: string = "signal") => {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    const response = await fetch(`${BASE_URL}/demo/simulate-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, action_type: actionType }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to simulate action")
    }
    return response.json()
  },
}
