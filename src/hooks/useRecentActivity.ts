
import { useState, useEffect } from 'react';
import { studentService, Student } from '@/lib/studentService';

export interface ActivityItem {
  id: string;
  type: 'student_added' | 'student_updated' | 'fee_paid' | 'student_deleted';
  message: string;
  timestamp: string;
  studentName?: string;
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const generateActivitiesFromData = () => {
      const students = studentService.getStudents();
      const recentActivities: ActivityItem[] = [];

      // Sort students by updatedAt to get most recent activities
      const sortedStudents = [...students].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      // Take the 5 most recent activities
      sortedStudents.slice(0, 5).forEach(student => {
        const createdTime = new Date(student.createdAt).getTime();
        const updatedTime = new Date(student.updatedAt).getTime();
        const studentName = `${student.firstName} ${student.lastName}`;

        if (createdTime === updatedTime) {
          // New student registration
          recentActivities.push({
            id: `${student.id}_created`,
            type: 'student_added',
            message: `New student registered: ${studentName}`,
            timestamp: student.createdAt,
            studentName
          });
        } else {
          // Student updated
          if (student.feePaid && student.paymentDate) {
            recentActivities.push({
              id: `${student.id}_paid`,
              type: 'fee_paid',
              message: `Fee payment confirmed: ${studentName}`,
              timestamp: student.paymentDate,
              studentName
            });
          } else {
            recentActivities.push({
              id: `${student.id}_updated`,
              type: 'student_updated',
              message: `Student record updated: ${studentName}`,
              timestamp: student.updatedAt,
              studentName
            });
          }
        }
      });

      // Sort by timestamp (most recent first)
      recentActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(recentActivities.slice(0, 3));
    };

    generateActivitiesFromData();
    
    // Refresh every 30 seconds
    const interval = setInterval(generateActivitiesFromData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return activities;
}
