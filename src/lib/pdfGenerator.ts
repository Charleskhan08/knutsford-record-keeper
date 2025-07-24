import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student } from './studentService';

export interface ReportData {
  paid: Student[];
  unpaid: Student[];
  totalAmount: number;
  paidAmount: number;
}

export const generateStudentsPDF = (students: Student[], title: string = 'All Students Report') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 30);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Prepare table data
  const tableData = students.map(student => [
    `${student.firstName} ${student.lastName}`,
    student.studentId,
    student.email,
    student.program,
    student.year,
    student.semester,
    `₵${student.feeAmount}`,
    student.feePaid ? 'Paid' : 'Unpaid',
    student.paymentDate ? new Date(student.paymentDate).toLocaleDateString() : 'N/A'
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Name', 'Student ID', 'Email', 'Program', 'Year', 'Semester', 'Fee Amount', 'Status', 'Payment Date']],
    body: tableData,
    startY: 60,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 15 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 15 },
      8: { cellWidth: 25 }
    }
  });
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generatePaymentReportPDF = (reportData: ReportData, title: string = 'Payment Report') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 30);
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Add summary
  doc.setFontSize(14);
  doc.text('Payment Summary', 20, 65);
  doc.setFontSize(12);
  doc.text(`Total Students: ${reportData.paid.length + reportData.unpaid.length}`, 20, 80);
  doc.text(`Fees Paid: ${reportData.paid.length}`, 20, 90);
  doc.text(`Outstanding Fees: ${reportData.unpaid.length}`, 20, 100);
  doc.text(`Total Revenue: ₵${reportData.paidAmount.toLocaleString()}`, 20, 110);
  doc.text(`Expected Revenue: ₵${reportData.totalAmount.toLocaleString()}`, 20, 120);
  
  // Add paid students table
  if (reportData.paid.length > 0) {
    doc.setFontSize(14);
    doc.text('Students with Paid Fees', 20, 140);
    
    const paidTableData = reportData.paid.map(student => [
      `${student.firstName} ${student.lastName}`,
      student.studentId,
      `₵${student.feeAmount}`,
      student.paymentDate ? new Date(student.paymentDate).toLocaleDateString() : 'N/A'
    ]);
    
    autoTable(doc, {
      head: [['Name', 'Student ID', 'Fee Amount', 'Payment Date']],
      body: paidTableData,
      startY: 150,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] }
    });
  }
  
  // Add unpaid students table on new page if needed
  if (reportData.unpaid.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Students with Outstanding Fees', 20, 30);
    
    const unpaidTableData = reportData.unpaid.map(student => [
      `${student.firstName} ${student.lastName}`,
      student.studentId,
      `₵${student.feeAmount}`,
      'Outstanding'
    ]);
    
    autoTable(doc, {
      head: [['Name', 'Student ID', 'Fee Amount', 'Status']],
      body: unpaidTableData,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [239, 68, 68] }
    });
  }
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};