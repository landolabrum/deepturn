// hooks/useTheme.ts
import { useState, useCallback } from 'react';

interface UseThemeReturn {
  classes: string;
  classNames: string[];
  setClasses: (newClasses: string | string[]) => void;
}

const useTheme = (): UseThemeReturn => {
  const [classNames, setClassNames] = useState<string[]>([]);

  const setClasses = useCallback((newClasses: string | string[]) => {
    if (typeof newClasses === 'string') {
      setClassNames(newClasses.split(' '));
    } else {
      setClassNames(newClasses);
    }
  }, []);

  const classes = classNames.join(' ');

  return { classes, classNames, setClasses };
};

export default useTheme;
