import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, BarChart3, TrendingUp, CreditCard, Users, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { studentService } from "@/lib/studentService";
import { generatePaymentReportPDF, generateStudentsPDF } from "@/lib/pdfGenerator";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { PeriodFilter } from "@/components/reports/PeriodFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Reports() {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  const allStudents = studentService.getStudents();
  
  // Filter students based on date range and semester
  const filteredStudents = useMemo(() => {
    let filtered = allStudents;
    
    // Filter by semester
    if (selectedSemester !== "all") {
      filtered = filtered.filter(student => student.semester === selectedSemester);
    }
    
    // Filter by date range (using createdAt date)
    if (startDate || endDate) {
      filtered = filtered.filter(student => {
        const studentDate = new Date(student.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && studentDate < start) return false;
        if (end && studentDate > end) return false;
        return true;
      });
    }
    
    return filtered;
  }, [allStudents, selectedSemester, startDate, endDate]);
  
  const paymentReport = useMemo(() => {
    const paid = filteredStudents.filter(student => student.feePaid);
    const unpaid = filteredStudents.filter(student => !student.feePaid);
    const totalAmount = filteredStudents.reduce((sum, student) => sum + student.feeAmount, 0);
    const paidAmount = paid.reduce((sum, student) => sum + student.feeAmount, 0);
    
    return { paid, unpaid, totalAmount, paidAmount };
  }, [filteredStudents]);

  const handleFilterChange = (newStartDate: string, newEndDate: string, newSemester: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setSelectedSemester(newSemester);
  };

  const handleGenerateReport = () => {
    let title = "Payment Report";
    if (selectedSemester !== "all") title += ` - ${selectedSemester}`;
    if (startDate || endDate) {
      title += ` (${startDate || 'Start'} to ${endDate || 'End'})`;
    }
    generatePaymentReportPDF(paymentReport, title);
  };

  const handleDownloadPaidReport = () => {
    const title = selectedSemester === "all" 
      ? "Paid Fees Report" 
      : `Paid Fees Report - ${selectedSemester}`;
    generateStudentsPDF(paymentReport.paid, title);
  };

  const handleDownloadUnpaidReport = () => {
    const title = selectedSemester === "all" 
      ? "Outstanding Fees Report" 
      : `Outstanding Fees Report - ${selectedSemester}`;
    generateStudentsPDF(paymentReport.unpaid, title);
  };

  const handleViewAllStudents = () => {
    navigate('/students/all');
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View comprehensive reports and analytics for student data and fee payments
          </p>
        </div>
        <Button className="bg-gradient-primary" onClick={handleGenerateReport}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Period Filter */}
      <PeriodFilter 
        onFilterChange={handleFilterChange}
        onGenerateReport={handleGenerateReport}
      />

      {/* Payment Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={allStudents.length.toString()}
          description="Registered students"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Fees Paid"
          value={paymentReport.paid.length.toString()}
          description={`${Math.round((paymentReport.paid.length / (paymentReport.paid.length + paymentReport.unpaid.length)) * 100)}% payment rate`}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Outstanding Fees"
          value={paymentReport.unpaid.length.toString()}
          description="Students with unpaid fees"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Revenue"
          value={`₵${paymentReport.paidAmount.toLocaleString()}`}
          description={`of ₵${paymentReport.totalAmount.toLocaleString()} expected`}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Payment Status Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Students with Paid Fees ({paymentReport.paid.length})
            </CardTitle>
            <CardDescription>
              Students who have completed their fee payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentReport.paid.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No paid fees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paymentReport.paid.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>₵{student.feeAmount}</TableCell>
                        <TableCell>
                          {student.paymentDate ? new Date(student.paymentDate).toLocaleDateString() : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleDownloadPaidReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Paid Fees Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              Students with Outstanding Fees ({paymentReport.unpaid.length})
            </CardTitle>
            <CardDescription>
              Students who still need to pay their fees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentReport.unpaid.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        All fees have been paid!
                      </TableCell>
                    </TableRow>
                  ) : (
                    paymentReport.unpaid.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>₵{student.feeAmount}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Unpaid</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleDownloadUnpaidReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Outstanding Fees Report
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
              <h4 className="font-medium mb-2">All Students Report</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Complete list of all registered students
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleViewAllStudents}>
                  View All
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateStudentsPDF(allStudents)}>
                  Generate PDF
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Payment Summary</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Overview of fee payments and outstanding balances
              </p>
              <Button size="sm" variant="outline" className="w-full" onClick={handleGenerateReport}>
                Generate PDF
              </Button>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Student Analytics</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Detailed analytics and insights about student data
              </p>
              <Button size="sm" variant="outline" className="w-full" onClick={() => generateStudentsPDF(allStudents, 'Student Analytics Report')}>
                Generate PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}