// frontend/src/modules/jobs/pages/JobsListPage.jsx

import { useEffect, useState, useCallback } from "react";
import api from "../../../services/apiClient";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import {
  Search,
  PlusCircle,
  Briefcase,
  TrendingUp,
  Loader2,
  Sparkles,
  Zap,
  Filter,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function JobsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ───── STATE ───── */
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    employmentType: undefined,
    mode: undefined,
    location: undefined,
    requiredSkills: [],
  });

  const [page, setPage] = useState(1);
  const limit = 20;

  const allowedToPostJob = ["admin", "alumni", "faculty"].includes(user?.role);

  /* ───── FETCH JOBS ───── */
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs", {
        params: {
          search: search.trim() || undefined,
          employmentType: filters.employmentType,
          mode: filters.mode,
          location: filters.location,
          requiredSkills:
            filters.requiredSkills?.length > 0
              ? filters.requiredSkills
              : undefined,
          page,
          limit,
        },
      });

      const data = res?.data?.data || [];

      setJobs((prev) => (page === 1 ? data : [...prev, ...data]));
    } catch (err) {
      console.error("❌ Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  }, [search, filters, page]);

  /* ───── AUTO FETCH ───── */
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  /* ───── SEARCH DEBOUNCE ───── */
  useEffect(() => {
    const t = setTimeout(() => {
      setJobs([]);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  /* ───── FILTER CHANGE ───── */
  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setJobs([]);
    setPage(1);
  };

  const loadMore = () => setPage((p) => p + 1);

  /* ───── UI ───── */
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Modern Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  {loading && page === 1
                    ? "Loading..."
                    : `${jobs.length} Active ${jobs.length === 1 ? "Position" : "Positions"}`}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
                Find your next
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mt-1">
                  opportunity
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                Discover roles from leading companies that match your skills and ambitions
              </p>
            </div>

            {allowedToPostJob && (
              <button
                onClick={() => navigate("/jobs/create")}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
              >
                <PlusCircle size={20} strokeWidth={2} />
                <span>Post Job</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar - Clean Design */}
        <div className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
              strokeWidth={2}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for jobs, companies, or keywords..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-4 focus:ring-gray-900/5 dark:focus:ring-white/5 transition-all text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-6">
              <JobFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Main Content - Jobs List */}
          <main className="lg:col-span-9">
            {/* Loading State - First Page */}
            {loading && page === 1 && (
              <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="relative w-12 h-12 mb-6">
                  <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
                  Loading opportunities
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Finding the best matches for you
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                  <Briefcase size={32} className="text-gray-400 dark:text-gray-600" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                  {search || filters.employmentType || filters.mode || filters.location || filters.requiredSkills?.length > 0
                    ? "Try adjusting your filters or search terms to find more opportunities."
                    : "New positions are posted regularly. Check back soon for updates."}
                </p>
                {(search || filters.employmentType || filters.mode || filters.location || filters.requiredSkills?.length > 0) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilters({
                        employmentType: undefined,
                        mode: undefined,
                        location: undefined,
                        requiredSkills: [],
                      });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg transition-all text-sm font-semibold"
                  >
                    <Filter size={16} />
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Jobs Grid */}
            {jobs.length > 0 && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {jobs.map((job, index) => (
                    <div
                      key={job._id}
                      style={{ 
                        animation: `fadeInUp 0.4s ease-out ${index * 0.03}s both`
                      }}
                    >
                      <JobCard job={job} currentUserRole={user?.role} />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {!loading && jobs.length >= limit && (
                  <div className="pt-6 text-center">
                    <button
                      onClick={loadMore}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-sm"
                    >
                      <TrendingUp size={18} strokeWidth={2} />
                      <span>Load More</span>
                    </button>
                  </div>
                )}

                {/* Loading More Indicator */}
                {loading && page > 1 && (
                  <div className="pt-6 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                      <Loader2 size={18} className="animate-spin text-gray-900 dark:text-white" strokeWidth={2} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Loading more opportunities...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Floating Action Button */}
        {allowedToPostJob && (
          <button
            onClick={() => navigate("/jobs/create")}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 z-50"
            aria-label="Post a job"
          >
            <PlusCircle size={24} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}