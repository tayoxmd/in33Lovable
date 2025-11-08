import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
<<<<<<< HEAD
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });
=======
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
>>>>>>> a6ad102384374fc3696efdda3640e9866dbbd366

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

<<<<<<< HEAD
  return isMobile;
=======
  return !!isMobile;
>>>>>>> a6ad102384374fc3696efdda3640e9866dbbd366
}
