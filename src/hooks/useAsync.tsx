import  { useState, useEffect, useCallback } from 'react';

// Hook
const useAsync = (asyncFunction: any, immediate = true) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback((...params) => {
    setPending(true);
    setValue(null);
    setError(null);
    return asyncFunction(...params)
      .then((response: any) => setValue(response))
      // eslint-disable-next-line no-shadow
      .catch((error: any) => setError(error))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, pending, value, error };
};

export default useAsync