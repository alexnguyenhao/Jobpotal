import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Users, Briefcase, FileText } from "lucide-react";

// --- MOCK DATA (Dữ liệu giả lập để test giao diện) ---
const dataGrowth = [
  { name: "Jan", students: 400, recruiters: 240 },
  { name: "Feb", students: 300, recruiters: 139 },
  { name: "Mar", students: 200, recruiters: 980 },
  { name: "Apr", students: 278, recruiters: 390 },
  { name: "May", students: 189, recruiters: 480 },
  { name: "Jun", students: 239, recruiters: 380 },
  { name: "Jul", students: 349, recruiters: 430 },
];

const dataJobs = [
  { name: "IT/Software", jobs: 120 },
  { name: "Marketing", jobs: 80 },
  { name: "Sales", jobs: 50 },
  { name: "Design", jobs: 40 },
  { name: "HR", jobs: 30 },
];

const dataStatus = [
  { name: "Active Jobs", value: 400 },
  { name: "Closed Jobs", value: 100 },
  { name: "Pending", value: 50 },
];

const COLORS = ["#6A38C2", "#FFBB28", "#FF8042"];

const Analytics = () => {
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50/50">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        System Analytics
      </h1>

      {/* 1. TOP CARDS - QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="12,345"
          icon={Users}
          trend="+12% from last month"
        />
        <StatCard
          title="Total Jobs"
          value="2,543"
          icon={Briefcase}
          trend="+5% from last month"
        />
        <StatCard
          title="Applications"
          value="45,231"
          icon={FileText}
          trend="+18% from last month"
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          icon={TrendingUp}
          trend="+1.1% from last month"
        />
      </div>

      {/* 2. MIDDLE ROW - CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New Students vs Recruiters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataGrowth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#6A38C2"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="recruiters"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Jobs by Category */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Jobs Distribution</CardTitle>
            <CardDescription>Top categories by posting volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataJobs}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="jobs" fill="#6A38C2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Status Pie Chart */}
        <Card className="shadow-sm border-gray-200 lg:col-span-1">
          <CardHeader>
            <CardTitle>Job Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity (Text List) */}
        <Card className="shadow-sm border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent System Logs</CardTitle>
            <CardDescription>
              Latest actions performed in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      New Recruiter Registered
                    </p>
                    <p className="text-xs text-gray-500">
                      Company: Tech Solution Inc.
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper Component
const StatCard = ({ title, value, icon: Icon, trend }) => (
  <Card className="shadow-sm border-gray-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-[#6A38C2]" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-green-600 mt-1">{trend}</p>
    </CardContent>
  </Card>
);

export default Analytics;
