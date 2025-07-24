import { Users, UserPlus, FileText, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentService } from "@/lib/studentService";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeCases: 0,
    newRegistrations: 0,
    engagementRate: 0,
    trends: {
      students: 0,
      cases: 0,
      registrations: 0,
      engagement: 0
    }
  });

  useEffect(() => {
    const calculateDashboardData = () => {
      const students = studentService.getStudents();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Total students
      const totalStudents = students.length;
      
      // New registrations this month
      const newRegistrations = students.filter(student => {
        const createdDate = new Date(student.createdAt);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      }).length;
      
      // Active cases (students with unpaid fees)
      const activeCases = students.filter(student => !student.feePaid).length;
      
      // Engagement rate (percentage of students with paid fees)
      const engagementRate = totalStudents > 0 
        ? Math.round((students.filter(student => student.feePaid).length / totalStudents) * 100)
        : 0;
      
      // Calculate trends (mock data for now - could be enhanced with historical data)
      const trends = {
        students: totalStudents > 0 ? Math.floor(Math.random() * 20) + 5 : 0,
        cases: activeCases > 0 ? -(Math.floor(Math.random() * 10) + 1) : 0,
        registrations: newRegistrations > 0 ? Math.floor(Math.random() * 15) + 5 : 0,
        engagement: Math.floor(Math.random() * 10) + 1
      };
      
      setDashboardData({
        totalStudents,
        activeCases,
        newRegistrations,
        engagementRate,
        trends
      });
    };

    calculateDashboardData();
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(calculateDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);
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
          value={dashboardData.totalStudents.toLocaleString()}
          description="Registered in the system"
          icon={<Users className="h-4 w-4" />}
          trend={{ 
            value: dashboardData.trends.students, 
            label: "from last month", 
            isPositive: dashboardData.trends.students > 0 
          }}
        />
        <StatsCard
          title="Active Cases"
          value={dashboardData.activeCases}
          description="Students with unpaid fees"
          icon={<FileText className="h-4 w-4" />}
          trend={{ 
            value: Math.abs(dashboardData.trends.cases), 
            label: "from last week", 
            isPositive: dashboardData.trends.cases < 0 
          }}
        />
        <StatsCard
          title="New Registrations"
          value={dashboardData.newRegistrations}
          description="This month"
          icon={<UserPlus className="h-4 w-4" />}
          trend={{ 
            value: dashboardData.trends.registrations, 
            label: "from last month", 
            isPositive: dashboardData.trends.registrations > 0 
          }}
        />
        <StatsCard
          title="Engagement Rate"
          value={`${dashboardData.engagementRate}%`}
          description="Fee payment rate"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ 
            value: dashboardData.trends.engagement, 
            label: "from last quarter", 
            isPositive: dashboardData.trends.engagement > 0 
          }}
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