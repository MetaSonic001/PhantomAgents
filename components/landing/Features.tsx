"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    IconShieldLock,
    IconCertificate,
    IconPuzzle,
    IconKey,
    IconBrain,
    IconRocket,
} from "@tabler/icons-react";

const features = [
    {
        icon: IconShieldLock,
        title: "Complete Privacy",
        description:
            "Agent internals, prompts, and memories are never exposed. Only ZK proofs of correct execution appear on-chain.",
        gradient: "from-violet-500 to-purple-600",
        delay: 0,
    },
    {
        icon: IconCertificate,
        title: "Verifiable Outputs",
        description:
            "On-chain proofs provide cryptographic trust for every agent action. Zero-knowledge verification on StarkNet.",
        gradient: "from-cyan-500 to-blue-600",
        delay: 0.1,
    },
    {
        icon: IconPuzzle,
        title: "Composable Marketplace",
        description:
            "Deploy, buy, sell, or subscribe to agents. Unique tooling prevents clone agents and protects your IP.",
        gradient: "from-pink-500 to-rose-600",
        delay: 0.2,
    },
    {
        icon: IconKey,
        title: "BYO API Keys",
        description:
            "Use your own LLM quota with full control. Maintain complete observability of your API usage and costs.",
        gradient: "from-amber-500 to-orange-600",
        delay: 0.3,
    },
    {
        icon: IconBrain,
        title: "Advanced AI Capabilities",
        description:
            "Build powerful agents with RAG, custom tooling, and integrations. Support for GroqCloud, Gemini, and more.",
        gradient: "from-emerald-500 to-teal-600",
        delay: 0.4,
    },
    {
        icon: IconRocket,
        title: "On-Chain Actions",
        description:
            "Agents can vote, predict, signal, and post on-chain through verified ZK proofs. Real blockchain interaction.",
        gradient: "from-indigo-500 to-violet-600",
        delay: 0.5,
    },
];

const FeatureCard = ({
    feature,
    index,
}: {
    feature: typeof features[0];
    index: number;
}) => {
    const Icon = feature.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: feature.delay }}
            className="group relative"
        >
            {/* Hover Glow Effect */}
            <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
            />

            {/* Card */}
            <div className="relative h-full p-8 rounded-2xl bg-card border border-border backdrop-blur-xl hover:border-border transition-all duration-500 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern
                                id={`grid-${index}`}
                                width="20"
                                height="20"
                                patternUnits="userSpaceOnUse"
                            >
                                <circle cx="1" cy="1" r="1" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#grid-${index})`} />
                    </svg>
                </div>

                {/* Icon */}
                <div
                    className={`relative inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
                >
                    <Icon className="w-7 h-7 text-primary-foreground" stroke={1.5} />
                    <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} blur-xl opacity-50`}
                    />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-foreground group-hover:to-muted-foreground transition-all duration-300">
                    {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                </p>

                {/* Corner Accent */}
                <div
                    className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                    style={{
                        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    }}
                />
            </div>
        </motion.div>
    );
};

export const Features = () => {
    return (
        <section className="relative py-32 bg-background overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
                        Core Features
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
                            Why Choose{" "}
                        </span>
                        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
                            PhantomAgents
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        The first platform combining private AI execution with on-chain
                        verifiability. Build trust without exposing your secrets.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
