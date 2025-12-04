"use client";

import React from "react";
import { motion } from "framer-motion";

const useCases = [
    {
        title: "DAO Governance",
        description: "AI agents that analyze proposals and vote transparently on-chain while keeping strategy private.",
        icon: "🏛️",
        users: "2.4k",
        gradient: "from-violet-600 to-indigo-600",
    },
    {
        title: "Algo Trading",
        description: "Execute trades with verifiable AI signals. Prove performance without revealing your alpha.",
        icon: "📈",
        users: "1.8k",
        gradient: "from-emerald-600 to-teal-600",
    },
    {
        title: "Research & Analysis",
        description: "Private data analysis with public, verifiable conclusions. Perfect for sensitive research.",
        icon: "🔬",
        users: "3.1k",
        gradient: "from-cyan-600 to-blue-600",
    },
    {
        title: "Social & Identity",
        description: "Privacy-first reputation systems. Prove credentials without exposing personal data.",
        icon: "🎭",
        users: "5.2k",
        gradient: "from-pink-600 to-rose-600",
    },
    {
        title: "Prediction Markets",
        description: "AI oracles for prediction markets with verifiable reasoning chains.",
        icon: "🎯",
        users: "1.2k",
        gradient: "from-amber-600 to-orange-600",
    },
    {
        title: "Web3 Integration",
        description: "Bridge AI capabilities with blockchain protocols. Verified cross-chain actions.",
        icon: "🔗",
        users: "4.7k",
        gradient: "from-indigo-600 to-purple-600",
    },
];

export const UseCases = () => {
    return (
        <section className="relative py-32 bg-gradient-to-b from-[#030014] to-[#0a0520] overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Floating accent */}
            <motion.div
                className="absolute top-1/2 left-0 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl"
                animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/3 right-0 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl"
                animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium mb-6">
                        Use Cases
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Built For{" "}
                        </span>
                        <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                            Every Builder
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        From DAOs to traders, researchers to identity builders — see how
                        teams are using PhantomAgents to build the future.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative"
                        >
                            {/* Hover Glow */}
                            <div
                                className={`absolute -inset-0.5 bg-gradient-to-r ${useCase.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}
                            />

                            <div className="relative h-full p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-xl hover:border-gray-700 transition-all duration-300 overflow-hidden">
                                {/* Icon & Badge */}
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-4xl">{useCase.icon}</span>
                                    <span className="px-3 py-1 rounded-full bg-gray-800/80 text-xs text-gray-400 font-medium">
                                        {useCase.users} users
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                                    {useCase.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {useCase.description}
                                </p>

                                {/* Arrow */}
                                <div className="mt-4 flex items-center text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                                    <span className="text-sm font-medium">Learn more</span>
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
