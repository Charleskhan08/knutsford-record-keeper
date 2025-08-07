import { Student } from "@/lib/studentService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ViewStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewStudentDialog({ student, open, onOpenChange }: ViewStudentDialogProps) {
  if (!student) return null;

  const getCurrencySymbol = (currency: string) => {
    return '₵'; // Always GHS currency
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            Complete information for {student.firstName} {student.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Personal Information</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-sm font-medium">Name:</span>
                  <p className="text-sm">{student.firstName} {student.lastName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Email:</span>
                  <p className="text-sm">{student.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Phone:</span>
                  <p className="text-sm">{student.phone || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Address:</span>
                  <p className="text-sm">{student.address || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Emergency Contact:</span>
                  <p className="text-sm">{student.emergencyContact || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Academic Information</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-sm font-medium">Student ID:</span>
                  <p className="text-sm">{student.studentId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Program:</span>
                  <p className="text-sm capitalize">{student.program.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Year:</span>
                  <p className="text-sm">{student.year}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Semester:</span>
                  <p className="text-sm">{student.semester}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Payment Information</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-sm font-medium">Fee Amount:</span>
                  <p className="text-sm">{getCurrencySymbol(student.currency)}{student.feeAmount}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Currency:</span>
                  <p className="text-sm">{student.currency}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Payment Status:</span>
                  <div className="mt-1">
                    {getPaymentBadge(student.feePaid)}
                  </div>
                </div>
                {student.paymentDate && (
                  <div>
                    <span className="text-sm font-medium">Payment Date:</span>
                    <p className="text-sm">{new Date(student.paymentDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Additional Information</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-sm font-medium">Notes:</span>
                  <p className="text-sm">{student.notes || 'No notes available'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Created:</span>
                  <p className="text-sm">{new Date(student.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Last Updated:</span>
                  <p className="text-sm">{new Date(student.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}