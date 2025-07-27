import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function useLoginNotification() {
  useEffect(() => {
    // Check if this is a fresh session
    const hasShownLoginNotification = sessionStorage.getItem('loginNotificationShown');
    
    if (!hasShownLoginNotification) {
      // Show welcome notification after a short delay
      const timer = setTimeout(() => {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged into the Student Management System.",
          duration: 5000,
        });
        
        // Mark as shown for this session
        sessionStorage.setItem('loginNotificationShown', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);
}