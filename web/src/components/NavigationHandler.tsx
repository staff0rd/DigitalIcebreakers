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
    // Navigate synchronously so the URL changes before React re-renders with
    // updated lobby state; deferring via setTimeout let the catch-all Redirect
    // mount on a transiently-unmatched route and override the navigation
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
