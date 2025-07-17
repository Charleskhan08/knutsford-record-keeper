import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: string;
  status: "active" | "inactive";
  lastContact: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@student.ku.edu",
    program: "Computer Science",
    year: "3rd Year",
    status: "active",
    lastContact: "2024-01-15",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@student.ku.edu",
    program: "Business Administration",
    year: "2nd Year",
    status: "active",
    lastContact: "2024-01-14",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@student.ku.edu",
    program: "Engineering",
    year: "4th Year",
    status: "inactive",
    lastContact: "2024-01-10",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@student.ku.edu",
    program: "Psychology",
    year: "1st Year",
    status: "active",
    lastContact: "2024-01-16",
  },
];

export function StudentTable() {
  const [students] = useState<Student[]>(mockStudents);

  const getStatusBadge = (status: Student["status"]) => {
    return status === "active" ? (
      <Badge className="status-active">Active</Badge>
    ) : (
      <Badge className="status-inactive">Inactive</Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.program}</TableCell>
              <TableCell>{student.year}</TableCell>
              <TableCell>{getStatusBadge(student.status)}</TableCell>
              <TableCell>{student.lastContact}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Student
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}