import { useEffect, useState } from 'react';

interface TabInfo {
  tab_id: string;
  url: string;
  isCurrent: boolean;
  focusTime: number; // Time in ms when the tab was last focused
  timeSpent: number; // Total time spent on the tab (while in focus)
  viewportWidth: number;
  viewportHeight: number;
  scrollPosition: { x: number, y: number };
}

const useTab = () => {
  const [tabInfo, setTabInfo] = useState<TabInfo>({
    tab_id: '',
    url: '',
    isCurrent: !document.hidden, // Initial visibility status
    focusTime: 0,
    timeSpent: 0,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    scrollPosition: { x: window.scrollX, y: window.scrollY },
  });

  const generateTabId = (): string => {
    return `tab-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleVisibilityChange = () => {
    const isVisible = !document.hidden;

    if (isVisible) {
      // Start focus timer when the tab becomes active
      setTabInfo((prev) => ({
        ...prev,
        isCurrent: true,
        focusTime: Date.now(),
      }));
    } else {
      // Calculate time spent on the tab and reset focusTime
      setTabInfo((prev) => ({
        ...prev,
        isCurrent: false,
        timeSpent: prev.timeSpent + (Date.now() - prev.focusTime),
        focusTime: 0,
      }));
    }
  };

  const handleFocus = () => {
    // Handle when the window gains focus
    setTabInfo((prev) => ({
      ...prev,
      isCurrent: true,
      focusTime: Date.now(),
    }));
  };

  const handleBlur = () => {
    // Handle when the window loses focus
    setTabInfo((prev) => ({
      ...prev,
      isCurrent: false,
      timeSpent: prev.timeSpent + (Date.now() - prev.focusTime),
      focusTime: 0,
    }));
  };

  const updateScrollPosition = () => {
    setTabInfo((prev) => ({
      ...prev,
      scrollPosition: { x: window.scrollX, y: window.scrollY },
    }));
  };

  const updateViewportSize = () => {
    setTabInfo((prev) => ({
      ...prev,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    }));
  };

  useEffect(() => {
    const tabId = generateTabId();
    setTabInfo((prev) => ({
      ...prev,
      tab_id: tabId,
      url: window.location.href,
    }));

    // Listen for visibility, focus/blur, resize, and scroll events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('scroll', updateScrollPosition);
    window.addEventListener('resize', updateViewportSize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('scroll', updateScrollPosition);
      window.removeEventListener('resize', updateViewportSize);
    };
  }, []);

  return { tabInfo };
};

export default useTab;
