import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

interface NavigateEvent extends Event {
  detail: {
    path: string;
  };
}

export const NavigationHandler = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as NavigateEvent;
      
      // Clear any pending navigation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Defer navigation to next tick to ensure only the last one executes
      timeoutRef.current = setTimeout(() => {
        navigate(customEvent.detail.path);
        timeoutRef.current = null;
      }, 0);
    };

    window.addEventListener("navigate-action", handleNavigate);
    
    return () => {
      window.removeEventListener("navigate-action", handleNavigate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigate]);

  return null;
};