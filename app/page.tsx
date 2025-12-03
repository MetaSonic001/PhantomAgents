"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Code2,
  Lock,
  BarChart3,
  Rocket,
  Sparkles,
  CheckCircle2,
  Play,
} from "lucide-react"

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">PA</span>
            </div>
            <span className="font-semibold text-lg">PhantomAgents</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#capabilities" className="text-sm text-muted-foreground hover:text-foreground transition">
              Capabilities
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Pricing
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
              Docs
            </a>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-md border border-border hover:bg-secondary transition"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block">
            <span className="text-xs font-medium text-muted-foreground border border-border rounded-full px-4 py-2 uppercase tracking-wider">
              Build • Deploy • Monetize
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-balance leading-tight tracking-tight">
            Enterprise-Grade AI Agents for Everyone
          </h1>

          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Create autonomous AI agents with privacy-first architecture. Build once, deploy instantly, and monetize on
            the global marketplace. No infrastructure expertise required.
          </p>

          <div className="flex gap-4 justify-center pt-4 flex-col sm:flex-row">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center justify-center gap-2 font-semibold text-lg"
            >
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#demo"
              className="px-8 py-4 rounded-md border border-border hover:bg-secondary transition font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" /> Watch Demo
            </a>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border mt-12">
            {[
              { label: "Active Agents", value: "2,847" },
              { label: "Total Transactions", value: "$12.4M" },
              { label: "Marketplace Listings", value: "1,234" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-20 rounded-xl border border-border bg-secondary/30 p-3">
          <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Powerful Features Built For Scale</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create production-ready agents with enterprise-grade security and reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Code2,
              title: "Visual Agent Builder",
              desc: "Intuitive drag-and-drop interface. No coding required.",
              features: ["Step-by-step wizard", "Live previews", "Template library"],
            },
            {
              icon: Zap,
              title: "Lightning Fast Deployment",
              desc: "Deploy agents instantly to production infrastructure.",
              features: ["Auto-scaling", "Global CDN", "99.8% uptime"],
            },
            {
              icon: Shield,
              title: "Privacy-First Architecture",
              desc: "End-to-end encryption and compliance built-in.",
              features: ["GDPR compliant", "Encrypted storage", "Audit logs"],
            },
            {
              icon: TrendingUp,
              title: "Real-Time Analytics",
              desc: "Monitor performance with comprehensive dashboards.",
              features: ["Live metrics", "Performance tracking", "ROI calculator"],
            },
            {
              icon: Users,
              title: "Global Marketplace",
              desc: "Browse, rent, and list agents with ease.",
              features: ["Smart search", "Reviews system", "Revenue sharing"],
            },
            {
              icon: Lock,
              title: "Security & Compliance",
              desc: "Enterprise-grade security standards.",
              features: ["2FA", "API keys", "Role management"],
            },
          ].map((feature, i) => (
            <div
              key={i}
              onClick={() => setActiveFeature(i)}
              className={`border rounded-lg p-8 transition cursor-pointer ${activeFeature === i ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}
            >
              <feature.icon className="w-10 h-10 mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{feature.desc}</p>
              <ul className="space-y-2">
                {feature.features.map((f) => (
                  <li key={f} className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Advanced Agent Capabilities</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from pre-built templates or create custom agents with advanced features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: BarChart3,
              title: "Trading & Signals",
              features: [
                "Real-time market analysis",
                "Automated trade execution",
                "Risk management protocols",
                "Portfolio tracking",
              ],
            },
            {
              icon: Rocket,
              title: "Prediction & Forecasting",
              features: ["ML-powered predictions", "Event forecasting", "Accuracy metrics", "Backtesting"],
            },
            {
              icon: Users,
              title: "Governance & DAO",
              features: ["Automated voting", "Proposal analysis", "Delegate management", "Treasury tracking"],
            },
            {
              icon: Code2,
              title: "Custom Workflows",
              features: ["API integrations", "Webhook support", "Custom code execution", "Data transformations"],
            },
          ].map((cap, i) => (
            <div key={i} className="border border-border rounded-lg p-8 hover:border-accent transition">
              <cap.icon className="w-10 h-10 mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-4">{cap.title}</h3>
              <ul className="space-y-3">
                {cap.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <h2 className="text-5xl font-bold text-center mb-16">Get Started in 4 Steps</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: 1, title: "Design", desc: "Configure your agent with our visual builder" },
            { step: 2, title: "Integrate", desc: "Connect data sources and external APIs" },
            { step: 3, title: "Test", desc: "Run simulations and validate behavior" },
            { step: 4, title: "Deploy", desc: "Go live and start earning revenue" },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full border-2 border-primary bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
              {i < 3 && <div className="hidden md:block absolute top-7 left-full w-8 h-0.5 bg-border"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <h2 className="text-5xl font-bold text-center mb-16">Trusted Use Cases</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Crypto Trading Automation",
              desc: "Execute complex trading strategies across multiple exchanges with real-time market data.",
              use: "TradeFi Labs",
            },
            {
              title: "DAO Governance Intelligence",
              desc: "Automate voting and proposal analysis for decentralized organizations.",
              use: "Governance Tools Inc",
            },
            {
              title: "Market Research & Analysis",
              desc: "Generate real-time research reports and market forecasts.",
              use: "Research Analytics Co",
            },
            {
              title: "Social Media Management",
              desc: "Automate content posting and engagement across platforms.",
              use: "Content Studios",
            },
            {
              title: "Risk Management",
              desc: "Monitor portfolios and implement automated hedging strategies.",
              use: "Asset Management Pro",
            },
            {
              title: "Data Pipeline Automation",
              desc: "Transform and process data from multiple sources.",
              use: "Data Solutions LLC",
            },
          ].map((useCase, i) => (
            <div key={i} className="border border-border rounded-lg p-6 bg-secondary/50 hover:border-accent transition">
              <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{useCase.desc}</p>
              <p className="text-xs text-accent font-medium">{useCase.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <h2 className="text-5xl font-bold text-center mb-16">Loved by Builders</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Chen",
              role: "CEO, TradeFi Labs",
              quote:
                "PhantomAgents reduced our deployment time from months to days. The builder is incredibly intuitive.",
              avatar: "👨‍💼",
            },
            {
              name: "Sarah Mitchell",
              role: "Head of Engineering",
              quote:
                "The privacy-first approach is exactly what we needed. Our clients trust us more because of PhantomAgents.",
              avatar: "👩‍💻",
            },
            {
              name: "James Lee",
              role: "Co-founder, DAO Tools",
              quote: "We went from no agents to a revenue-generating marketplace in 2 weeks. Incredible platform.",
              avatar: "👨‍🚀",
            },
          ].map((testimonial, i) => (
            <div key={i} className="border border-border rounded-lg p-8 bg-card">
              <p className="text-muted-foreground italic mb-6">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Transparent Pricing for Every Stage</h2>
          <p className="text-xl text-muted-foreground">Start free, grow as you scale</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "Free",
              desc: "Perfect for experimenting",
              features: ["1 Agent", "Basic Capabilities", "Community Support", "Public Marketplace Access"],
            },
            {
              name: "Professional",
              price: "$99",
              period: "/month",
              desc: "For growing teams",
              popular: true,
              features: [
                "Unlimited Agents",
                "Advanced Features",
                "Priority Support",
                "Analytics Dashboard",
                "API Access",
                "Custom Integrations",
              ],
            },
            {
              name: "Enterprise",
              price: "Custom",
              desc: "For large organizations",
              features: [
                "Everything in Pro",
                "White Label Option",
                "Dedicated Account Manager",
                "Custom SLA",
                "On-Premises Option",
                "Training & Support",
              ],
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`rounded-lg border ${plan.popular ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"} p-8 relative transition hover:border-accent`}
            >
              {plan.popular && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="font-semibold text-xl mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{plan.desc}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>}
              </div>
              <button
                className={`w-full py-3 rounded-md font-semibold transition mb-8 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                Get Started
              </button>
              <ul className="space-y-3">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="text-sm text-muted-foreground flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border text-center">
        <h2 className="text-5xl font-bold mb-6">Ready to Build Smarter Agents?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join hundreds of developers and teams building the future of autonomous AI. Start free, no credit card
          required.
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2"
          >
            Launch Builder <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#" className="px-8 py-4 rounded-md border border-border hover:bg-secondary transition font-semibold">
            Schedule Demo
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">PA</span>
                </div>
                <span className="font-semibold">PhantomAgents</span>
              </div>
              <p className="text-sm text-muted-foreground">Enterprise-grade AI agents for everyone</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">&copy; 2025 PhantomAgents. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition">
                Discord
              </a>
              <a href="#" className="hover:text-foreground transition">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
