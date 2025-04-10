
import { useEffect } from "react";

/**
 * Hook that handles scrolling to hash locations on page load and hash changes
 * 
 * @param offset - Offset from the top to account for fixed headers
 */
export function useHashScroll(offset: number = 100): void {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            // Scroll to element with offset for header
            window.scrollTo({
              top: element.getBoundingClientRect().top + window.scrollY - offset,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    // Initial check for hash in URL
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [offset]);
}

export default useHashScroll;
