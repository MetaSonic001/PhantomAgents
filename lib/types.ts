export interface Agent {
  id: string
  name: string
  type: string
  status: "active" | "inactive" | "draft" | "archived"
  description?: string
  created: string
  updated?: string
  price?: number
  rating?: number
  reviews?: number
  version?: number
  deployments?: Deployment[]
}

export interface Deployment {
  id: string
  agentId: string
  version: number
  environment: "development" | "staging" | "production"
  status: "active" | "failed" | "paused"
  createdAt: string
  metrics?: DeploymentMetrics
}

export interface DeploymentMetrics {
  executionCount: number
  successRate: number
  avgResponseTime: number
  errorCount: number
  lastExecutionAt?: string
}

export interface MarketplaceAgent extends Agent {
  creator: string
  trending?: boolean
  successRate?: string
  avgReturn?: string
  users?: number
  reviewCount?: number
  totalRevenue?: number
}

export interface Competition {
  id: string
  name: string
  status: "active" | "upcoming" | "ended" | "paused"
  prize: number
  participants: number
  endDate: string
  description?: string
  rules?: string
  leaderboard?: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  rank: number
  agentId: string
  agentName: string
  creator: string
  score: number
  wins: number
  returns: number
}

export interface AnalyticsMetrics {
  totalActions: number
  successRate: number
  avgResponseTime: number
  errorCount: number
  totalRevenue: number
  costPerExecution?: number
  topAgents?: AgentMetrics[]
}

export interface AgentMetrics {
  agentId: string
  agentName: string
  executions: number
  successRate: number
  avgResponseTime: number
  revenue: number
  trend: number
}

export interface User {
  id: string
  email: string
  name: string
  role: "owner" | "admin" | "editor" | "viewer"
  createdAt?: string
  plan?: "free" | "professional" | "enterprise"
  teamId?: string
}

export interface TeamMember {
  id: string
  user: User
  role: "owner" | "admin" | "editor" | "viewer"
  joinedAt: string
  permissions?: string[]
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  status: "active" | "inactive"
  secret: string
  createdAt: string
  lastTriggeredAt?: string
  deliveryCount: number
}

export interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  createdAt: string
  lastUsedAt?: string
  expiresAt?: string
  permissions: string[]
}

export interface Notification {
  id: string
  userId: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface AgentRun {
  id: string
  agentId: string
  agentName: string
  status: "success" | "error" | "pending" | "running"
  input: Record<string, any>
  output?: Record<string, any>
  error?: string
  duration: number
  cost: number
  createdAt: string
  completedAt?: string
}

export interface UsageMetrics {
  apiCalls: { used: number; limit: number }
  agents: { used: number; limit: number }
  storage: { used: number; limit: number }
  executions: { used: number; limit: number }
  monthlySpend: number
  costThreshold?: number
}

export interface BillingPlan {
  id: string
  name: "free" | "professional" | "enterprise"
  monthlyPrice: number
  yearlyPrice?: number
  features: string[]
  limits: UsageMetrics
  support: "community" | "priority" | "dedicated"
}

export interface Team {
  id: string
  name: string
  ownerId: string
  members: TeamMember[]
  createdAt: string
}

export interface CollaborationComment {
  id: string
  userId: string
  userName: string
  content: string
  agentId: string
  timestamp: string
  resolved: boolean
}

export interface ChangeRequest {
  id: string
  agentId: string
  proposedBy: string
  changes: Record<string, any>
  status: "pending" | "approved" | "rejected"
  createdAt: string
  reviewedBy?: string
  reviewedAt?: string
}

export interface AgentVersion {
  id: string
  agentId: string
  versionNumber: number
  tag?: string
  changes: string[]
  createdAt: string
  createdBy: string
  isProduction: boolean
}

export interface ABTest {
  id: string
  agentId: string
  versionA: string
  versionB: string
  trafficSplit: number
  startDate: string
  endDate?: string
  status: "running" | "completed"
  metricsA: TestMetrics
  metricsB: TestMetrics
}

export interface TestMetrics {
  successRate: number
  avgResponseTime: number
  cost: number
  conversions: number
  revenue: number
}

export interface SafetyScore {
  hallucination: number
  bias: number
  toxicity: number
  pii: number
  overall: number
  issues: SafetyIssue[]
}

export interface SafetyIssue {
  id: string
  type: "hallucination" | "bias" | "toxicity" | "pii" | "factual"
  severity: "low" | "medium" | "high"
  description: string
  content: string
  suggestion?: string
}

export interface MemoryEntry {
  id: string
  type: "episodic" | "semantic" | "procedural"
  content: string
  embedding?: number[]
  timestamp: string
  relevance: number
}

export interface RAGDocument {
  id: string
  agentId: string
  title: string
  content: string
  chunks: RAGChunk[]
  uploadedAt: string
  size: number
}

export interface RAGChunk {
  id: string
  documentId: string
  content: string
  embedding?: number[]
  metadata?: Record<string, any>
}

export interface ApprovalWorkflow {
  id: string
  agentId: string
  name: string
  triggers: string[]
  approvers: string[]
  autoApproveThreshold?: number
  timeoutMinutes?: number
  status: "active" | "inactive"
}

export interface ApprovalRequest {
  id: string
  workflowId: string
  actionId: string
  actionType: string
  actionData: Record<string, any>
  requiredApprovals: number
  approvals: Approval[]
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export interface Approval {
  id: string
  requestId: string
  approverId: string
  approverName: string
  decision: "approve" | "reject"
  comments?: string
  timestamp: string
}

export interface IntegrationConfig {
  id: string
  agentId: string
  provider: string
  authType: "oauth" | "apikey" | "webhook"
  credentials?: Record<string, string>
  fieldMappings?: Record<string, string>
  triggers?: string[]
  status: "connected" | "disconnected"
  lastSync?: string
}

export interface VoiceConfig {
  id: string
  agentId: string
  provider: "twilio" | "vonage" | "google"
  voiceId: string
  voiceName: string
  accent: "neutral" | "american" | "british" | "indian"
  tone: "professional" | "casual" | "friendly"
  pace: number
  pitch: number
  enabled: boolean
}

export interface AgentTemplate {
  id: string
  name: string
  description: string
  category: "business" | "finance" | "trading" | "research" | "governance"
  config: Record<string, any>
  thumbnail?: string
  popularity: number
  rating: number
  downloads: number
}

export interface WorkflowNode {
  id: string
  type: "trigger" | "ai" | "logic" | "data" | "integration" | "action" | "human"
  label: string
  config: Record<string, any>
  inputs?: string[]
  outputs?: string[]
  position?: { x: number; y: number }
}

export interface Workflow {
  id: string
  agentId: string
  name: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  status: "draft" | "published"
}

export interface WorkflowEdge {
  source: string
  target: string
  condition?: string
}

export interface CostAnalysis {
  totalCost: number
  costPerAgent: Record<string, number>
  costPerModel: Record<string, number>
  costTrend: number[]
  forecast: number
  recommendations: CostRecommendation[]
}

export interface CostRecommendation {
  title: string
  description: string
  potentialSavings: number
  implementation: string
}

export interface ReviewMetadata {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
  reviews: AgentReview[]
}

export interface AgentReview {
  id: string
  agentId: string
  reviewerId: string
  rating: number
  title: string
  content: string
  helpful: number
  createdAt: string
  verified: boolean
}
