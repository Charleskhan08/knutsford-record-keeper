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
  currency: 'USD' | 'GBP' | 'GHC';
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
  currency: 'USD' | 'GBP' | 'GHC';
  semester: string;
}

class StudentService {
  private storageKey = 'students';

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private initializeWithSampleData(): void {
    const existingStudents = this.getStudents();
    if (existingStudents.length === 0) {
      const sampleStudents = this.generateSampleStudents();
      this.saveStudents(sampleStudents);
    }
  }

  private generateSampleStudents(): Student[] {
    const programs = ['computer-science', 'business', 'engineering', 'psychology', 'mathematics', 'english'];
    const years = ['1', '2', '3', '4'];
    const semesters = ['2024-1', '2024-2', '2025-1'];
    const currencies: ('USD' | 'GBP' | 'GHC')[] = ['USD', 'GBP', 'GHC'];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Jessica', 'Robert', 'Ashley', 'William', 'Amanda', 'Christopher', 'Jennifer', 'Matthew', 'Lisa', 'Andrew', 'Michelle', 'Joshua', 'Kimberly', 'Daniel', 'Donna', 'Anthony', 'Carol', 'Mark', 'Sandra', 'Steven', 'Ruth', 'Kenneth', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

    const sampleStudents: Student[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < 30; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const program = programs[Math.floor(Math.random() * programs.length)];
      const year = years[Math.floor(Math.random() * years.length)];
      const semester = semesters[Math.floor(Math.random() * semesters.length)];
      const currency = currencies[Math.floor(Math.random() * currencies.length)];
      const feePaid = Math.random() > 0.4;
      const feeAmount = Math.floor(Math.random() * 2000) + 500;

      sampleStudents.push({
        id: this.generateId(),
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`,
        phone: `+233${Math.floor(Math.random() * 900000000) + 100000000}`,
        studentId: `${20240000 + i + 1}`,
        program,
        year,
        address: `${Math.floor(Math.random() * 999) + 1} University Street, Campus City`,
        emergencyContact: `Emergency Contact ${i + 1} - +233${Math.floor(Math.random() * 900000000) + 100000000}`,
        notes: i % 5 === 0 ? `Special notes for ${firstName} ${lastName}` : '',
        feePaid,
        feeAmount,
        currency,
        paymentDate: feePaid ? now : undefined,
        semester,
        createdAt: now,
        updatedAt: now,
      });
    }

    return sampleStudents;
  }

  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      const students = data ? JSON.parse(data) : [];
      if (students.length === 0) {
        this.initializeWithSampleData();
        return this.getStudents();
      }
      return students;
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