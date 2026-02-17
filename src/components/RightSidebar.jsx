"use client";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import {
  Info,
  Plus,
  TrendingUp,
  Briefcase,
  Calendar,
  Users,
  ArrowRight,
  BookOpen,
  Award,
  Target,
} from "lucide-react";

export function RightSidebar() {
  const newsItems = [
    {
      title: "Tech industry sees major growth",
      subtitle: "2 hours ago • 1,234 readers",
      trending: true,
    },
    {
      title: "Remote work trends in 2025",
      subtitle: "4 hours ago • 892 readers",
      trending: false,
    },
    {
      title: "AI development accelerates",
      subtitle: "6 hours ago • 2,156 readers",
      trending: true,
    },
    {
      title: "Startup funding reaches new highs",
      subtitle: "8 hours ago • 567 readers",
      trending: false,
    },
    {
      title: "Green technology innovations",
      subtitle: "12 hours ago • 1,445 readers",
      trending: true,
    },
  ];

  const suggestedConnections = [
    {
      name: "Sarah Johnson",
      title: "Senior Developer at TechCorp",
      mutualConnections: 12,
      avatar: null,
    },
    {
      name: "Michael Chen",
      title: "Product Manager at StartupXYZ",
      mutualConnections: 8,
      avatar: null,
    },
    {
      name: "Emily Davis",
      title: "UX Designer at DesignStudio",
      mutualConnections: 15,
      avatar: null,
    },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* LinkedIn News */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              LinkedIn News
            </h4>
          </div>
          <div className="space-y-3">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                      {item.trending && (
                        <TrendingUp className="h-3 w-3 mr-1 text-orange-500" />
                      )}
                      {item.title}
                    </h5>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-3 text-sm text-gray-600 justify-center"
          >
            Show more
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Add to your feed */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Add to your feed</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-900">
                  Tech Learning Hub
                </h5>
                <p className="text-xs text-gray-500">Company • Technology</p>
              </div>
              <Button size="sm" variant="outline" className="ml-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-900">
                  Startup Success
                </h5>
                <p className="text-xs text-gray-500">Newsletter • Business</p>
              </div>
              <Button size="sm" variant="outline" className="ml-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-900">
                  Career Growth Tips
                </h5>
                <p className="text-xs text-gray-500">Hashtag • Career</p>
              </div>
              <Button size="sm" variant="outline" className="ml-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full mt-3 text-sm text-gray-600 justify-center"
          >
            View all recommendations
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* People you may know */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-4">
            People you may know
          </h4>
          <div className="space-y-4">
            {suggestedConnections.map((person, index) => (
              <div key={index} className="flex items-start">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
                  {getInitials(person.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 truncate">
                    {person.name}
                  </h5>
                  <p className="text-xs text-gray-500 mb-1 line-clamp-2">
                    {person.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {person.mutualConnections} mutual connections
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 w-full">
                    <Users className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            className="w-full mt-3 text-sm text-gray-600 justify-center"
          >
            Show all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center">
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 mb-2">
          <span className="hover:text-blue-600 cursor-pointer">About</span>
          <span>•</span>
          <span className="hover:text-blue-600 cursor-pointer">
            Accessibility
          </span>
          <span>•</span>
          <span className="hover:text-blue-600 cursor-pointer">
            Help Center
          </span>
          <span>•</span>
          <span className="hover:text-blue-600 cursor-pointer">Privacy</span>
          <span>•</span>
          <span className="hover:text-blue-600 cursor-pointer">Terms</span>
        </div>
        <p className="text-xs text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="#0A66C2"
            className="w-4 h-4 inline-block mr-1"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn Corporation © 2026
        </p>
      </div>
    </div>
  );
}
