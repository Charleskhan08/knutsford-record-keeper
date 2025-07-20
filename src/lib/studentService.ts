export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  program: string;
  year: string;
  address: string;
  emergencyContact: string;
  notes: string;
  feePaid: boolean;
  feeAmount: number;
  paymentDate?: string;
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  program: string;
  year: string;
  address: string;
  emergencyContact: string;
  notes: string;
  feePaid: boolean;
  feeAmount: number;
  semester: string;
}

class StudentService {
  private storageKey = 'students';

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading students:', error);
      return [];
    }
  }

  addStudent(formData: StudentFormData): Student {
    const students = this.getStudents();
    const now = new Date().toISOString();
    
    const newStudent: Student = {
      id: this.generateId(),
      ...formData,
      paymentDate: formData.feePaid ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    students.push(newStudent);
    this.saveStudents(students);
    return newStudent;
  }

  updateStudent(id: string, formData: StudentFormData): Student | null {
    const students = this.getStudents();
    const index = students.findIndex(student => student.id === id);
    
    if (index === -1) return null;

    const updatedStudent: Student = {
      ...students[index],
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    students[index] = updatedStudent;
    this.saveStudents(students);
    return updatedStudent;
  }

  deleteStudent(id: string): boolean {
    const students = this.getStudents();
    const filteredStudents = students.filter(student => student.id !== id);
    
    if (filteredStudents.length === students.length) return false;
    
    this.saveStudents(filteredStudents);
    return true;
  }

  getStudentById(id: string): Student | null {
    const students = this.getStudents();
    return students.find(student => student.id === id) || null;
  }

  markFeeAsPaid(id: string): boolean {
    const students = this.getStudents();
    const student = students.find(s => s.id === id);
    
    if (!student) return false;
    
    student.feePaid = true;
    student.paymentDate = new Date().toISOString();
    student.updatedAt = new Date().toISOString();
    
    this.saveStudents(students);
    return true;
  }

  getPaymentReport(semester?: string): { paid: Student[]; unpaid: Student[]; totalAmount: number; paidAmount: number } {
    const students = this.getStudents();
    const filteredStudents = semester ? students.filter(s => s.semester === semester) : students;
    
    const paid = filteredStudents.filter(s => s.feePaid);
    const unpaid = filteredStudents.filter(s => !s.feePaid);
    
    const totalAmount = filteredStudents.reduce((sum, s) => sum + s.feeAmount, 0);
    const paidAmount = paid.reduce((sum, s) => sum + s.feeAmount, 0);
    
    return { paid, unpaid, totalAmount, paidAmount };
  }

  private saveStudents(students: Student[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(students));
    } catch (error) {
      console.error('Error saving students:', error);
    }
  }
}

export const studentService: StudentService = new StudentService();