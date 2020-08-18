import { useEffect, useState } from 'react';

function debounce(fn: any, ms: any) {
  let timer: any;
  return function(this: typeof debounce) {
    clearTimeout(timer);
    timer = setTimeout(_ => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

export default function useHeight() {
  const [height, setHeight] = useState(window.innerHeight * (window.visualViewport?.scale || 1));

  // useEffect(() => {
  //   const onResize = () => {
  //     setHeight(window.innerHeight * (window.visualViewport?.scale || 1));
  //   };

  //   window.addEventListener('resize', onResize);
  //   return () => {
  //     window.removeEventListener('resize', onResize);
  //   };
  // });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setHeight(window.innerHeight * (window.visualViewport?.scale || 1));
    }, 1000);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  return height + 'px';
}

// useEffect(() => {
//   const debouncedHandleResize = debounce(function handleResize() {
//   setHeight(window.innerHeight * (window.visualViewport?.scale || 1));
//   }, 1000);

//   window.addEventListener('resize', debouncedHandleResize);

//   return () => {
//     window.removeEventListener('resize', debouncedHandleResize);
//   };
// }, []);
