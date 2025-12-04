"use client"

import React from "react"
import { motion } from "framer-motion"

export function AmbientBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Hexagon faint grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons-ambient" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <polygon points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4" fill="none" stroke="url(#hexGradientAmbient)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="hexGradientAmbient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons-ambient)" />
      </svg>

      {/* Floating orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-linear-to-r from-violet-600/30 to-indigo-600/30 blur-3xl"
        style={{ top: "8%", left: "6%" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full bg-linear-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"
        style={{ top: "48%", right: "8%" }}
        animate={{ x: [0, -36, 0], y: [0, -46, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-64 h-64 rounded-full bg-linear-to-r from-purple-600/25 to-pink-500/25 blur-3xl"
        style={{ bottom: "18%", left: "28%" }}
        animate={{ x: [0, 56, 0], y: [0, -36, 0], scale: [1, 0.95, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle glowing horizontal lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent"
            style={{ width: "100%", top: `${18 + i * 14}%`, left: 0 }}
            animate={{ opacity: [0.15, 0.45, 0.15], scaleX: [0.9, 1, 0.9] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
      </div>
    </div>
  )
}

export default AmbientBackground
