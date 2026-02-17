"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { RightSidebar } from "@/components/RightSidebar";
import { 
  MessageSquare, 
  Search, 
  Send,
  MoreVertical,
  Paperclip,
  Smile,
  Image as ImageIcon
} from "lucide-react";

export default function MessagingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: null,
      lastMessage: "Thanks for connecting! Looking forward to collaborating.",
      timestamp: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: null,
      lastMessage: "Did you see the latest project updates?",
      timestamp: "1h ago",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: null,
      lastMessage: "Great meeting today!",
      timestamp: "3h ago",
      unread: 1,
      online: false,
    },
    {
      id: 4,
      name: "David Kim",
      avatar: null,
      lastMessage: "Let's schedule a call next week",
      timestamp: "1d ago",
      unread: 0,
      online: false,
    },
  ];

  // Sample messages for selected chat
  const chatMessages = selectedChat ? [
    {
      id: 1,
      sender: "them",
      text: "Hey! How are you doing?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "I'm doing great! Thanks for asking. How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      sender: "them",
      text: "Pretty good! I wanted to discuss the project we talked about.",
      timestamp: "10:33 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "Sure! I'd love to hear more about it.",
      timestamp: "10:35 AM",
    },
    {
      id: 5,
      sender: "them",
      text: "Thanks for connecting! Looking forward to collaborating.",
      timestamp: "10:36 AM",
    },
  ] : [];

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      // In a real app, send message to backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-3.5rem)] bg-gray-100">
      <div className="container mx-auto px-4 py-4 h-full max-w-7xl">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Conversations List */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messaging
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search messages"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedChat(conv)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedChat?.id === conv.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {conv.avatar ? (
                        <Image
                          src={conv.avatar}
                          alt={conv.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {conv.name.charAt(0)}
                        </div>
                      )}
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {conv.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="col-span-12 md:col-span-8 lg:col-span-6">
            <Card className="h-full flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {selectedChat.avatar ? (
                          <Image
                            src={selectedChat.avatar}
                            alt={selectedChat.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {selectedChat.name.charAt(0)}
                          </div>
                        )}
                        {selectedChat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedChat.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {selectedChat.online ? "Active now" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            msg.sender === "me"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === "me"
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Paperclip className="h-5 w-5 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <ImageIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Smile className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                      <Input
                        type="text"
                        placeholder="Write a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!message.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-start justify-center pt-20">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your Messages
                    </h3>
                    <p className="text-gray-600">
                      Select a conversation to start messaging
                    </p>
                  </div>
                </div>
              )}
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
