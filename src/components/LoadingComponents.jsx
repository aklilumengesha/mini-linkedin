"use client";
import { motion } from "framer-motion";

export function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function ContentLoader({ lines = 3, avatar = false, className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-start space-x-4">
        {avatar && (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`h-4 bg-gray-200 rounded ${
                index === lines - 1 ? "w-3/4" : "w-full"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardLoader({ className = "" }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 animate-pulse ${className}`}
    >
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="h-32 bg-gray-200 rounded mb-4" />
      <div className="flex space-x-4">
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded flex-1" />
      </div>
    </div>
  );
}
