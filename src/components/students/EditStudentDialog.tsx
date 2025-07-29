import { useState, useEffect } from "react";
import { Student, studentService } from "@/lib/studentService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface EditStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentUpdated: () => void;
}

export function EditStudentDialog({ student, open, onOpenChange, onStudentUpdated }: EditStudentDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    program: "",
    year: "",
    address: "",
    emergencyContact: "",
    notes: "",
    feePaid: false,
    feeAmount: 0,
    currency: "GHC" as 'USD' | 'GBP' | 'GHC',
    semester: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        studentId: student.studentId,
        program: student.program,
        year: student.year,
        address: student.address,
        emergencyContact: student.emergencyContact,
        notes: student.notes,
        feePaid: student.feePaid,
        feeAmount: student.feeAmount,
        currency: student.currency,
        semester: student.semester,
      });
      setErrors({});
    }
  }, [student]);

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
    if (!phone.trim()) return null;
    if (!/^[0-9\s\-\+\(\)]+$/.test(phone)) return "Phone number should only contain numbers, spaces, +, -, (, )";
    return null;
  };

  const validateStudentId = (studentId: string): string | null => {
    if (!studentId.trim()) return "Student ID is required";
    if (!/^[0-9]+$/.test(studentId)) return "Student ID should only contain numbers (0-9)";
    return null;
  };

  const handleInputChange = (field: string, value: string) => {
    const processedValue = field === "feePaid" ? value === "true" : field === "feeAmount" ? Number(value) : value;
    
    setFormData(prev => ({ 
      ...prev, 
      [field]: processedValue
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

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
      case "studentId":
        error = validateStudentId(value);
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) return;

    const newErrors: Record<string, string> = {};
    
    const firstNameError = validateName(formData.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateName(formData.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const studentIdError = validateStudentId(formData.studentId);
    if (studentIdError) newErrors.studentId = studentIdError;

    if (!formData.program) newErrors.program = "Program is required";
    if (!formData.year) newErrors.year = "Academic year is required";
    if (!formData.semester) newErrors.semester = "Semester is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedStudent = studentService.updateStudent(student.id, formData);
      if (updatedStudent) {
        toast({
          title: "Student Updated",
          description: `${updatedStudent.firstName} ${updatedStudent.lastName} has been updated successfully.`,
        });
        onStudentUpdated();
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update information for {student.firstName} {student.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                className={errors.studentId ? "border-destructive" : ""}
              />
              {errors.studentId && (
                <p className="text-sm text-destructive">{errors.studentId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program *</Label>
              <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
                <SelectTrigger className={errors.program ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="business">Business Administration</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="english">English Literature</SelectItem>
                </SelectContent>
              </Select>
              {errors.program && (
                <p className="text-sm text-destructive">{errors.program}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Academic Year *</Label>
              <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                <SelectTrigger className={errors.year ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                <SelectTrigger className={errors.semester ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-1">2024 - First Semester</SelectItem>
                  <SelectItem value="2024-2">2024 - Second Semester</SelectItem>
                  <SelectItem value="2025-1">2025 - First Semester</SelectItem>
                  <SelectItem value="2025-2">2025 - Second Semester</SelectItem>
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-sm text-destructive">{errors.semester}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeAmount">Fee Amount *</Label>
              <Input
                id="feeAmount"
                type="number"
                value={formData.feeAmount}
                onChange={(e) => handleInputChange("feeAmount", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">$ (USD)</SelectItem>
                  <SelectItem value="GBP">£ (GBP)</SelectItem>
                  <SelectItem value="GHC">₵ (GHC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feePaid">Payment Status</Label>
              <Select value={formData.feePaid.toString()} onValueChange={(value) => handleInputChange("feePaid", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Paid</SelectItem>
                  <SelectItem value="false">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              <Save className="mr-2 h-4 w-4" />
              Update Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}