export const trackEvent = (name: string, data: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, data);
  }
};
