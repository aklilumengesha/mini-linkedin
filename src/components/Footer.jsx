"use client";
import Link from "next/link";
import { Users } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-gradient-to-bl from-blue-400 to-blue-600 rounded-lg p-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">LinkedIn</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 LinkedIn. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
