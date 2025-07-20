import { useState, useMemo, useEffect } from "react";
import { MoreHorizontal, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { studentService, Student } from "@/lib/studentService";
import { useToast } from "@/hooks/use-toast";

interface StudentTableProps {
  searchTerm?: string;
  filterProgram?: string;
  filterYear?: string;
}

export function StudentTable({ searchTerm = "", filterProgram = "", filterYear = "" }: StudentTableProps) {
  const [allStudents, setAllStudents] = useState<Student[]>(() => studentService.getStudents());
  const { toast } = useToast();

  // Refresh students data when component mounts or when external changes occur
  useEffect(() => {
    setAllStudents(studentService.getStudents());
  }, []);

  // Filter students based on search and filter criteria
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesSearch = searchTerm === "" || 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram = filterProgram === "" || filterProgram === "all" || 
        student.program === filterProgram;

      const matchesYear = filterYear === "" || filterYear === "all" || 
        student.year === filterYear;

      return matchesSearch && matchesProgram && matchesYear;
    });
  }, [allStudents, searchTerm, filterProgram, filterYear]);

  const handleMarkAsPaid = (studentId: string) => {
    const success = studentService.markFeeAsPaid(studentId);
    if (success) {
      setAllStudents(studentService.getStudents());
      toast({
        title: "Payment Updated",
        description: "Student fee has been marked as paid.",
      });
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    const success = studentService.deleteStudent(studentId);
    if (success) {
      setAllStudents(studentService.getStudents());
      toast({
        title: "Student Deleted",
        description: "Student record has been successfully deleted.",
      });
    }
  };

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="w-3 h-3 mr-1" />
        Paid
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Unpaid
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Fee Amount</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                {searchTerm || filterProgram || filterYear ? 
                  "No students match the current filters." : 
                  "No students found. Add your first student to get started."
                }
              </TableCell>
            </TableRow>
          ) : (
            filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.firstName} {student.lastName}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>{student.year}</TableCell>
                <TableCell>{student.semester}</TableCell>
                <TableCell>${student.feeAmount}</TableCell>
                <TableCell>{getPaymentBadge(student.feePaid)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Student</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!student.feePaid && (
                        <DropdownMenuItem onClick={() => handleMarkAsPaid(student.id)}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}