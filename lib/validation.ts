export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Invalid email address" }
  }
  return null
}

export function validatePassword(password: string): ValidationError | null {
  if (password.length < 8) {
    return { field: "password", message: "Password must be at least 8 characters" }
  }
  if (!/[A-Z]/.test(password)) {
    return { field: "password", message: "Password must contain uppercase letter" }
  }
  if (!/[0-9]/.test(password)) {
    return { field: "password", message: "Password must contain number" }
  }
  return null
}

export function validateAgentName(name: string): ValidationError | null {
  if (!name || name.length < 3) {
    return { field: "name", message: "Agent name must be at least 3 characters" }
  }
  if (name.length > 50) {
    return { field: "name", message: "Agent name must not exceed 50 characters" }
  }
  return null
}

export function validateAgentDescription(desc: string): ValidationError | null {
  if (!desc || desc.length < 10) {
    return { field: "description", message: "Description must be at least 10 characters" }
  }
  return null
}
