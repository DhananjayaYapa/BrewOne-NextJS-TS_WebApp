import { useEffect, useState } from 'react';

export function useDebouncedText(value: string, milliSeconds: number, defaultState: string = '') {
  const [debouncedValue, setDebouncedValue] = useState(defaultState);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), milliSeconds || 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [value, milliSeconds]);

  return debouncedValue;
}
