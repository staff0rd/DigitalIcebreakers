import { useEffect } from "react";
import { useNavigate } from "react-router";

interface NavigateEvent extends Event {
  detail: {
    path: string;
  };
}

export const NavigationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as NavigateEvent;
      navigate(customEvent.detail.path);
    };

    window.addEventListener("navigate-action", handleNavigate);
    
    return () => {
      window.removeEventListener("navigate-action", handleNavigate);
    };
  }, [navigate]);

  return null;
};