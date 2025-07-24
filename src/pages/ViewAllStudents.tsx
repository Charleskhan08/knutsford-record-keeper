import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studentService } from "@/lib/studentService";
import { generateStudentsPDF } from "@/lib/pdfGenerator";
import { useState, useEffect } from "react";

export default function ViewAllStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(studentService.getStudents());

  useEffect(() => {
    setStudents(studentService.getStudents());
  }, []);

  const handleDownloadPDF = () => {
    generateStudentsPDF(students, 'All Students Report');
  };

  const getPaymentBadge = (isPaid: boolean) => {
    return (
      <Badge variant={isPaid ? "default" : "destructive"}>
        {isPaid ? "Paid" : "Unpaid"}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">All Students</h2>
            <p className="text-muted-foreground">
              Complete list of all registered students
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
          <CardDescription>
            Total students: {students.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Fee Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.program}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell>₵{student.feeAmount}</TableCell>
                    <TableCell>{getPaymentBadge(student.feePaid)}</TableCell>
                    <TableCell>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}