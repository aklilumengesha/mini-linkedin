"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { RightSidebar } from "@/components/RightSidebar";
import { LoadingSpinner } from "@/components/LoadingComponents";
import { Users, UserPlus, UserCheck, Building, MapPin } from "lucide-react";

export default function NetworkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState(new Set());

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchUsers();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        console.log("All users from API:", data);
        console.log("Current user UID:", user?.uid);
        // Filter out current user
        const filteredUsers = data.filter((u) => u.firebaseUid !== user?.uid);
        console.log("Filtered users (excluding current):", filteredUsers);
        setUsers(filteredUsers);
      } else {
        console.error("Failed to fetch users:", response.status);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (userId) => {
    setConnections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold text-gray-900 mb-4">Manage my network</h2>
                <div className="space-y-2">
                  <Link href="/network">
                    <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Connections</span>
                      </div>
                      <span className="text-gray-500">{connections.size}</span>
                    </button>
                  </Link>
                  <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Invitations</span>
                    </div>
                    <span className="text-gray-500">0</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  People you may know
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No users found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((person) => (
                      <div
                        key={person._id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600" />
                        <div className="p-4 -mt-8">
                          <Link href={`/profile/${person.firebaseUid}`}>
                            {person.profilePicture ? (
                              <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden mx-auto mb-3 cursor-pointer">
                                <Image
                                  src={person.profilePicture}
                                  alt={person.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-full border-4 border-white bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-semibold mx-auto mb-3 cursor-pointer">
                                {person.name?.charAt(0) || "U"}
                              </div>
                            )}
                          </Link>
                          <div className="text-center mb-3">
                            <Link href={`/profile/${person.firebaseUid}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                {person.name}
                              </h3>
                            </Link>
                            {person.headline && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {person.headline}
                              </p>
                            )}
                            {person.location && (
                              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{person.location}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleConnect(person._id)}
                            variant={connections.has(person._id) ? "outline" : "default"}
                            className="w-full"
                            size="sm"
                          >
                            {connections.has(person._id) ? (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Connected
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Connect
                              </>
                            )}
                          </Button>
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
