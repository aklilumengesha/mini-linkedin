"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { RightSidebar } from "@/components/RightSidebar";
import { 
  Bell, 
  ThumbsUp, 
  MessageCircle, 
  UserPlus, 
  Share2,
  Briefcase,
  TrendingUp,
  Settings,
  Check,
  X
} from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    loadNotifications();
  }, [user, router]);

  const loadNotifications = () => {
    // Sample notifications data
    const sampleNotifications = [
      {
        id: 1,
        type: "like",
        user: "Sarah Johnson",
        avatar: null,
        action: "liked your post",
        content: "Great insights on software development!",
        timestamp: "2 hours ago",
        read: false,
      },
      {
        id: 2,
        type: "comment",
        user: "Michael Chen",
        avatar: null,
        action: "commented on your post",
        content: "I completely agree with your perspective...",
        timestamp: "5 hours ago",
        read: false,
      },
      {
        id: 3,
        type: "connection",
        user: "Emily Rodriguez",
        avatar: null,
        action: "accepted your connection request",
        content: null,
        timestamp: "1 day ago",
        read: true,
      },
      {
        id: 4,
        type: "share",
        user: "David Kim",
        avatar: null,
        action: "shared your post",
        content: "This is exactly what I was looking for!",
        timestamp: "2 days ago",
        read: true,
      },
      {
        id: 5,
        type: "job",
        user: "Tech Corp",
        avatar: null,
        action: "posted a new job that matches your profile",
        content: "Senior Software Engineer - Remote",
        timestamp: "3 days ago",
        read: true,
      },
      {
        id: 6,
        type: "connection",
        user: "Alex Thompson",
        avatar: null,
        action: "wants to connect with you",
        content: null,
        timestamp: "4 days ago",
        read: true,
        pending: true,
      },
      {
        id: 7,
        type: "like",
        user: "Jessica Lee",
        avatar: null,
        action: "and 12 others liked your comment",
        content: "Thanks for sharing this valuable information!",
        timestamp: "5 days ago",
        read: true,
      },
      {
        id: 8,
        type: "trending",
        user: "LinkedIn",
        avatar: null,
        action: "Your post is trending",
        content: "Your post has reached 1,000 views!",
        timestamp: "1 week ago",
        read: true,
      },
    ];
    setNotifications(sampleNotifications);
  };

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4 text-blue-600" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case "connection":
        return <UserPlus className="h-4 w-4 text-purple-600" />;
      case "share":
        return <Share2 className="h-4 w-4 text-orange-600" />;
      case "job":
        return <Briefcase className="h-4 w-4 text-indigo-600" />;
      case "trending":
        return <TrendingUp className="h-4 w-4 text-pink-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const handleConnectionResponse = (id, accept) => {
    console.log(accept ? "Accepted" : "Declined", "connection request", id);
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-9">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {[
                { value: "all", label: "All" },
                { value: "unread", label: "Unread" },
                { value: "like", label: "Likes" },
                { value: "comment", label: "Comments" },
                { value: "connection", label: "Connections" },
                { value: "job", label: "Jobs" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === tab.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notif.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {notif.avatar ? (
                          <Image
                            src={notif.avatar}
                            alt={notif.user}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {notif.user.charAt(0)}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                          {getIcon(notif.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{notif.user}</span>{" "}
                          <span className="text-gray-700">{notif.action}</span>
                        </p>
                        {notif.content && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notif.content}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {notif.timestamp}
                        </p>

                        {/* Connection Request Actions */}
                        {notif.pending && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => handleConnectionResponse(notif.id, true)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConnectionResponse(notif.id, false)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Unread Indicator */}
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
