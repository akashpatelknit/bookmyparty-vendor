import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer, CartesianGrid } from "recharts";
import type { DashboardStats, Activity } from "@shared/schema";
import { Link } from "wouter";

const chartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
};

const pieChartConfig: ChartConfig = {
  count: {
    label: "Events",
  },
  music: {
    label: "Music",
    color: "hsl(var(--chart-1))",
  },
  sports: {
    label: "Sports",
    color: "hsl(var(--chart-2))",
  },
  tech: {
    label: "Tech",
    color: "hsl(var(--chart-3))",
  },
  art: {
    label: "Art",
    color: "hsl(var(--chart-4))",
  },
  food: {
    label: "Food",
    color: "hsl(var(--chart-5))",
  },
};

function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && trendValue && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-destructive" />
            )}
            <span className={`text-xs ${trend === "up" ? "text-emerald-500" : "text-destructive"}`}>
              {trendValue}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start gap-3 py-3" data-testid={`activity-item-${activity.id}`}>
      <Avatar className="h-9 w-9">
        <AvatarImage src={activity.userAvatar || undefined} alt={activity.userName || "User"} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {(activity.userName || "U").slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{activity.userName}</span>{" "}
          <span className="text-muted-foreground">{activity.description}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
      </div>
      <Badge variant="secondary" className="text-xs shrink-0">
        {activity.action}
      </Badge>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/orders">
            <Button variant="outline" data-testid="button-view-orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Orders
            </Button>
          </Link>
          <Button data-testid="button-create-event">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Events"
          value={stats?.totalEvents ?? 0}
          icon={Calendar}
          trend="up"
          trendValue="12%"
          loading={statsLoading}
        />
        <StatsCard
          title="Active Events"
          value={stats?.activeEvents ?? 0}
          icon={TrendingUp}
          trend="up"
          trendValue="8%"
          loading={statsLoading}
        />
        <StatsCard
          title="Registered Users"
          value={stats?.registeredUsers ?? 0}
          icon={Users}
          trend="up"
          trendValue="23%"
          loading={statsLoading}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={DollarSign}
          trend="up"
          trendValue="18%"
          loading={statsLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2" data-testid="card-revenue-chart">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trends over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={stats?.monthlyRevenue || []} accessibilityLayer>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `$${value / 1000}k`}
                    className="text-xs text-muted-foreground"
                  />
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card data-testid="card-category-chart">
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>Distribution by event type</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
                  <Pie
                    data={stats?.categoryBreakdown || []}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {(stats?.categoryBreakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {(stats?.categoryBreakdown || []).map((category) => (
                <div key={category.category} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.fill }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {category.category}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card data-testid="card-recent-activity">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full max-w-[300px] mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {(activities || []).slice(0, 5).map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
              {(!activities || activities.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity to display
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
