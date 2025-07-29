
import { useState, useEffect, useRef } from "react";
import { Search, User, Edit, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { studentService, Student } from "@/lib/studentService";
import { useToast } from "@/hooks/use-toast";

// Validation functions
const validateName = (name: string): string | null => {
  if (!name.trim()) return "This field is required";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should only contain alphabets and spaces";
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return null; // Phone is optional
  if (!/^[0-9\s\-\+\(\)]+$/.test(phone)) return "Phone number should only contain numbers, spaces, +, -, (, )";
  return null;
};

interface EditableSearchProps {
  placeholder?: string;
  className?: string;
  onStudentUpdated?: () => void;
}

export function EditableSearch({ 
  placeholder = "Search students...", 
  className,
  onStudentUpdated 
}: EditableSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const students = studentService.getStudents();
      const filtered = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.program.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      
      setSearchResults(filtered);
      setIsOpen(true);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setEditingStudent(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      program: student.program,
      year: student.year,
      feeAmount: student.feeAmount,
    });
    setEditErrors({});
  };

  const handleEditInputChange = (field: string, value: string) => {
    const processedValue = field === "feeAmount" ? Number(value) : value;
    
    setEditForm(prev => ({ 
      ...prev, 
      [field]: processedValue
    }));

    // Clear error when user starts typing
    if (editErrors[field]) {
      setEditErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Real-time validation
    let error: string | null = null;
    switch (field) {
      case "firstName":
      case "lastName":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
    }

    if (error) {
      setEditErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSaveEdit = () => {
    if (!editingStudent) return;

    // Validate all fields before saving
    const newErrors: Record<string, string> = {};
    
    if (editForm.firstName) {
      const firstNameError = validateName(editForm.firstName);
      if (firstNameError) newErrors.firstName = firstNameError;
    }
    
    if (editForm.lastName) {
      const lastNameError = validateName(editForm.lastName);
      if (lastNameError) newErrors.lastName = lastNameError;
    }
    
    if (editForm.email) {
      const emailError = validateEmail(editForm.email);
      if (emailError) newErrors.email = emailError;
    }
    
    if (editForm.phone) {
      const phoneError = validatePhone(editForm.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    setEditErrors(newErrors);

    // If there are errors, don't save
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    const updatedStudent = studentService.updateStudent(editingStudent.id, {
      firstName: editForm.firstName || editingStudent.firstName,
      lastName: editForm.lastName || editingStudent.lastName,
      email: editForm.email || editingStudent.email,
      phone: editForm.phone || editingStudent.phone,
      studentId: editingStudent.studentId,
      program: editForm.program || editingStudent.program,
      year: editForm.year || editingStudent.year,
      address: editingStudent.address,
      emergencyContact: editingStudent.emergencyContact,
      notes: editingStudent.notes,
      feePaid: editingStudent.feePaid,
      feeAmount: editForm.feeAmount || editingStudent.feeAmount,
      semester: editingStudent.semester,
    });

    if (updatedStudent) {
      toast({
        title: "Student Updated",
        description: "Student information has been successfully updated.",
      });
      setEditingStudent(null);
      setEditForm({});
      setEditErrors({});
      onStudentUpdated?.();
      // Refresh search results
      setSearchResults(prev => 
        prev.map(student => 
          student.id === editingStudent.id ? updatedStudent : student
        )
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditForm({});
    setEditErrors({});
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
          onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
        />
      </div>

      {isOpen && searchResults.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {searchResults.map((student) => (
                <div key={student.id} className="border-b border-border last:border-b-0">
                  {editingStudent?.id === student.id ? (
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Input
                            placeholder="First Name"
                            value={editForm.firstName || ''}
                            onChange={(e) => handleEditInputChange("firstName", e.target.value)}
                            className={`text-sm ${editErrors.firstName ? "border-destructive" : ""}`}
                          />
                          {editErrors.firstName && (
                            <p className="text-xs text-destructive">{editErrors.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Input
                            placeholder="Last Name"
                            value={editForm.lastName || ''}
                            onChange={(e) => handleEditInputChange("lastName", e.target.value)}
                            className={`text-sm ${editErrors.lastName ? "border-destructive" : ""}`}
                          />
                          {editErrors.lastName && (
                            <p className="text-xs text-destructive">{editErrors.lastName}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Input
                          placeholder="Email"
                          value={editForm.email || ''}
                          onChange={(e) => handleEditInputChange("email", e.target.value)}
                          className={`text-sm ${editErrors.email ? "border-destructive" : ""}`}
                        />
                        {editErrors.email && (
                          <p className="text-xs text-destructive">{editErrors.email}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Input
                            placeholder="Phone"
                            value={editForm.phone || ''}
                            onChange={(e) => handleEditInputChange("phone", e.target.value)}
                            className={`text-sm ${editErrors.phone ? "border-destructive" : ""}`}
                          />
                          {editErrors.phone && (
                            <p className="text-xs text-destructive">{editErrors.phone}</p>
                          )}
                        </div>
                        <Input
                          placeholder="Program"
                          value={editForm.program || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, program: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Year"
                          value={editForm.year || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, year: e.target.value }))}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Fee Amount"
                          type="number"
                          value={editForm.feeAmount || ''}
                          onChange={(e) => handleEditInputChange("feeAmount", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 hover:bg-muted/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {student.firstName} {student.lastName}
                          </p>
                          <Badge variant={student.feePaid ? "default" : "secondary"} className="text-xs">
                            {student.feePaid ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                        <p className="text-xs text-muted-foreground">{student.program} - {student.year}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isOpen && searchTerm.length > 0 && searchResults.length === 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-3">
            <p className="text-sm text-muted-foreground text-center">
              No students found matching "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
