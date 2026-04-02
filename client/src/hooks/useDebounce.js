import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 300ms)
 * @returns {any} The debounced value
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes or the component unmounts
    // This prevents the debounced value from updating if the change is too frequent
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
