"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./Button";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import { 
  Home, 
  LogOut, 
  User, 
  Search,
  Bell,
  MessageSquare,
  Briefcase,
  Users
} from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile to get profile picture
  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.uid}`)
        .then(res => res.json())
        .then(data => setUserProfile(data))
        .catch(err => console.error('Error fetching user profile:', err));
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Search */}
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <Link href="/" className="flex items-center flex-shrink-0">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="#0A66C2"
                className="w-9 h-9"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </Link>

            {user && (
              <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="I'm looking for..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-blue-50 border-0 rounded text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </form>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-1">
                {/* Home */}
                <Link href="/">
                  <button className="flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors group">
                    <Home className="h-6 w-6 mb-0.5" />
                    <span className="text-xs font-medium">Home</span>
                  </button>
                </Link>

                {/* Network */}
                <Link href="/network">
                  <button className="flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors group">
                    <Users className="h-6 w-6 mb-0.5" />
                    <span className="text-xs font-medium">Network</span>
                  </button>
                </Link>

                {/* Jobs */}
                <Link href="/jobs">
                  <button className="flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors group">
                    <Briefcase className="h-6 w-6 mb-0.5" />
                    <span className="text-xs font-medium">Jobs</span>
                  </button>
                </Link>

                {/* Messaging */}
                <button className="flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors group">
                  <MessageSquare className="h-6 w-6 mb-0.5" />
                  <span className="text-xs font-medium">Messaging</span>
                </button>

                {/* Notifications */}
                <button className="flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors group relative">
                  <Bell className="h-6 w-6 mb-0.5" />
                  <span className="text-xs font-medium">Notifications</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex flex-col items-center px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {userProfile?.profilePicture ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden mb-0.5 border border-gray-300">
                        <Image
                          src={userProfile.profilePicture}
                          alt="Profile"
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold mb-0.5">
                        {getInitials(user?.displayName || user?.email || "U")}
                      </div>
                    )}
                    <span className="text-xs font-medium flex items-center">
                      Me
                      <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>
                  
                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            {userProfile?.profilePicture ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                                <Image
                                  src={userProfile.profilePicture}
                                  alt="Profile"
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                                {getInitials(user?.displayName || user?.email || "U")}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {userProfile?.name || user?.displayName || "User"}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-1">
                          <Link href={`/profile/${user.uid}`}>
                            <button 
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <User className="h-4 w-4 mr-3" />
                              View Profile
                            </button>
                          </Link>
                        </div>

                        <div className="border-t border-gray-200 py-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-gray-600 hover:bg-gray-100">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4">
                    Join now
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
