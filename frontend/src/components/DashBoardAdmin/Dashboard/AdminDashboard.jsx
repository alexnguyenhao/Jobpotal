import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetAdminStats from "@/hooks/adminHooks/useGetAdminStats"; // Hook lấy thống kê
import useAdminCompanies from "@/hooks/adminHooks/useAdminCompanies"; // Hook lấy công ty
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Recharts (Biểu đồ)
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Mon", users: 40, jobs: 24 },
  { name: "Tue", users: 30, jobs: 13 },
  { name: "Wed", users: 20, jobs: 98 },
  { name: "Thu", users: 27, jobs: 39 },
  { name: "Fri", users: 18, jobs: 48 },
  { name: "Sat", users: 23, jobs: 38 },
  { name: "Sun", users: 34, jobs: 43 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  // 1. Lấy dữ liệu thống kê
  const { stats, loading: statsLoading } = useGetAdminStats();

  // 2. Lấy danh sách công ty để lọc ra công ty đang chờ duyệt
  const { companies, loading: companiesLoading } = useAdminCompanies();

  // Lọc ra 5 công ty mới nhất đang chờ duyệt (Pending)
  const pendingCompanies = companies.filter((c) => !c.isVerified).slice(0, 5);

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 space-y-8">
      {/* --- 1. HEADER --- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, Administrator!</p>
        </div>
        <Button
          className="bg-black hover:bg-gray-800"
          onClick={() => navigate("/admin/settings")}
        >
          System Settings
        </Button>
      </div>

      {/* --- 2. STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-600"
          bg="bg-blue-50"
          loading={statsLoading}
        />
        <StatCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={Building2}
          color="text-purple-600"
          bg="bg-purple-50"
          loading={statsLoading}
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          color="text-orange-600"
          bg="bg-orange-50"
          loading={statsLoading}
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={FileText}
          color="text-green-600"
          bg="bg-green-50"
          loading={statsLoading}
        />
      </div>

      {/* --- 3. MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: CHART (2/3) */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-gray-200 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} className="text-[#6A38C2]" />
                Weekly Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6A38C2"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6A38C2"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#6A38C2"
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: PENDING REQUESTS (1/3) */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-gray-200 h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-gray-100 bg-red-50/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                  <AlertCircle size={20} className="text-red-500" />
                  Pending Companies
                </CardTitle>
                <Badge variant="secondary" className="bg-white">
                  {pendingCompanies.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              {companiesLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : pendingCompanies.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {pendingCompanies.map((company) => (
                    <div
                      key={company._id}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <Avatar className="h-10 w-10 border border-gray-100">
                        <AvatarImage src={company.logo} />
                        <AvatarFallback className="bg-red-100 text-red-600 font-bold">
                          {company.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                          {company.name}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={10} />{" "}
                          {new Date(company.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}`)
                        }
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                  <CheckCircle2 size={48} className="text-green-100 mb-2" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-xs">No pending company requests.</p>
                </div>
              )}
            </CardContent>
            {pendingCompanies.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <Button
                  variant="ghost"
                  className="w-full text-xs text-[#6A38C2] hover:text-[#5a2ea6]"
                  onClick={() => navigate("/admin/companies")}
                >
                  View All Companies <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, color, bg, loading }) => (
  <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
    <CardContent className="p-6 flex items-center gap-4">
      <div className={`p-4 rounded-full ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-20 mt-1" />
        ) : (
          <h2 className="text-3xl font-bold text-gray-900">
            {value?.toLocaleString() || 0}
          </h2>
        )}
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
