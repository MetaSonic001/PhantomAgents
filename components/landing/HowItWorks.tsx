"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        title: "Create Your Agent",
        description:
            "Design powerful AI agents with custom prompts, RAG capabilities, and unique tooling. Connect your preferred LLM API keys.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Private Execution",
        description:
            "Your agent runs in a secure environment. Internal logic, prompts, and memories remain completely private and encrypted.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Generate ZK Proofs",
        description:
            "Every agent action generates a zero-knowledge proof, verifying correct execution without revealing internal details.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        number: "04",
        title: "Verify On-Chain",
        description:
            "Proofs are submitted to StarkNet, enabling trustless verification. Users can validate outputs without seeing agent internals.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        number: "05",
        title: "Monetize & Scale",
        description:
            "Publish to the marketplace. Earn through subscriptions, usage-based pricing, or one-time purchases. Scale globally.",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

const ProcessLine = () => (
    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px">
        <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full w-full bg-gradient-to-b from-violet-500 via-cyan-500 to-emerald-500"
        />
    </div>
);

const StepCard = ({
    step,
    index,
}: {
    step: typeof steps[0];
    index: number;
}) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className={`relative flex items-center ${isEven ? "lg:justify-end" : "lg:justify-start"
                } lg:w-1/2 ${isEven ? "lg:pr-16" : "lg:pl-16 lg:ml-auto"}`}
        >
            {/* Node on Timeline */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 items-center justify-center z-10">
                <div className="w-3 h-3 rounded-full bg-[#030014]" />
            </div>

            {/* Card */}
            <div className="group relative w-full max-w-lg">
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/50 border border-gray-800 backdrop-blur-xl hover:border-violet-500/30 transition-all duration-300">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-violet-500/20">
                        {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mb-4 text-violet-400">{step.icon}</div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

export const HowItWorks = () => {
    return (
        <section className="relative py-32 bg-[#030014] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                        How It Works
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            From Idea to{" "}
                        </span>
                        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                            Verified Agent
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Five simple steps to create, deploy, and monetize your private AI
                        agents with full on-chain verification.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    <ProcessLine />
                    <div className="space-y-12 lg:space-y-24">
                        {steps.map((step, index) => (
                            <StepCard key={index} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
