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

  private saveStudents(students: Student[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(students));
    } catch (error) {
      console.error('Error saving students:', error);
    }
  }
}

export const studentService = new StudentService();