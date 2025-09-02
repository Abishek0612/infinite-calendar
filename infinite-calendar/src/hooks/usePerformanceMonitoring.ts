import { useEffect } from "react";

export const usePerformanceMonitoring = (componentName: string) => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (
          entry.entryType === "measure" &&
          entry.name.includes(componentName)
        ) {
          console.log(`${componentName} performance:`, {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      });
    });

    observer.observe({ entryTypes: ["measure"] });

    performance.mark(`${componentName}-start`);

    return () => {
      performance.mark(`${componentName}-end`);
      performance.measure(
        `${componentName}-render`,
        `${componentName}-start`,
        `${componentName}-end`
      );
      observer.disconnect();
    };
  }, [componentName]);
};
