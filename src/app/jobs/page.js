"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { RightSidebar } from "@/components/RightSidebar";
import { LoadingSpinner } from "@/components/LoadingComponents";
import { 
  Briefcase, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign,
  Search,
  Bookmark,
  ExternalLink
} from "lucide-react";

export default function JobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Sample job data (in a real app, this would come from an API)
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      posted: "2 days ago",
      description: "We're looking for a senior software engineer to join our team...",
      applicants: 45,
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100k - $150k",
      posted: "1 week ago",
      description: "Lead product strategy and development for our flagship product...",
      applicants: 78,
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Design Studio",
      location: "Remote",
      type: "Contract",
      salary: "$80k - $120k",
      posted: "3 days ago",
      description: "Create beautiful and intuitive user experiences...",
      applicants: 32,
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "Analytics Inc",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$110k - $160k",
      posted: "5 days ago",
      description: "Analyze complex data sets and build predictive models...",
      applicants: 56,
    },
    {
      id: 5,
      title: "Frontend Developer",
      company: "Web Solutions",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$90k - $130k",
      posted: "1 day ago",
      description: "Build responsive and performant web applications...",
      applicants: 23,
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "Cloud Systems",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$115k - $165k",
      posted: "4 days ago",
      description: "Manage infrastructure and deployment pipelines...",
      applicants: 41,
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = location === "" || job.location.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold text-gray-900 mb-4">Search filters</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Job title or keyword
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search jobs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="City or state"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Job type</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Full-time</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Part-time</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Contract</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Remote</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Recommended jobs
                  </CardTitle>
                  <span className="text-sm text-gray-600">
                    {filteredJobs.length} jobs found
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No jobs found matching your criteria</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {job.company.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 cursor-pointer">
                                  {job.title}
                                </h3>
                                <p className="text-gray-700 font-medium">{job.company}</p>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{job.type}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{job.salary}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                  {job.description}
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                  <span>{job.applicants} applicants</span>
                                  <span>•</span>
                                  <span>{job.posted}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Bookmark
                              className={`h-5 w-5 ${
                                savedJobs.has(job.id)
                                  ? "fill-blue-600 text-blue-600"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            Apply now
                          </Button>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4" />
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
