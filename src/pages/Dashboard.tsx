import { Users, UserPlus, FileText, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the SRC Record Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value="2,847"
          description="Registered in the system"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 12, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Active Cases"
          value="23"
          description="Ongoing student issues"
          icon={<FileText className="h-4 w-4" />}
          trend={{ value: -5, label: "from last week", isPositive: false }}
        />
        <StatsCard
          title="New Registrations"
          value="156"
          description="This month"
          icon={<UserPlus className="h-4 w-4" />}
          trend={{ value: 8, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Engagement Rate"
          value="73%"
          description="Student participation"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 3, label: "from last quarter", isPositive: true }}
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for SRC members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Student
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View All Students
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    New student registered: Alice Johnson
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-secondary"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Report generated: Monthly engagement
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Student record updated: Bob Smith
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}