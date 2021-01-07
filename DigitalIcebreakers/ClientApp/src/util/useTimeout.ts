import { useEffect } from "react";

export const useTimeout = (
  action: () => void,
  delayInMilliseconds: number,
  deps?: React.DependencyList
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      action();
    }, delayInMilliseconds);
    return () => clearTimeout(timer);
  }, deps);
};
