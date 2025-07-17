import { BarChart3, FileText, TrendingUp, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default function Reports() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View insights and generate reports on student data
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Records"
          value="2,847"
          description="Students in database"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Students"
          value="2,654"
          description="Currently enrolled"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Programs"
          value="12"
          description="Different academic programs"
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <StatsCard
          title="Reports Generated"
          value="47"
          description="This month"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Demographics</CardTitle>
            <CardDescription>
              Breakdown of students by program and year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Computer Science</span>
                <span className="text-sm font-medium">824 students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Business Administration</span>
                <span className="text-sm font-medium">612 students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Engineering</span>
                <span className="text-sm font-medium">567 students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Psychology</span>
                <span className="text-sm font-medium">453 students</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" />
              Download Full Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>
              Student participation and activity levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Engagement</span>
                <span className="text-sm font-medium text-secondary">1,247 students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium Engagement</span>
                <span className="text-sm font-medium text-accent">987 students</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low Engagement</span>
                <span className="text-sm font-medium text-destructive">613 students</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Based on SRC interaction frequency
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" />
              Download Engagement Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Pre-configured reports you can generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Monthly Summary</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive overview of all student activities
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Generate
              </Button>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Program Analysis</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Detailed breakdown by academic programs
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Generate
              </Button>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Engagement Report</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Student participation and interaction metrics
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}