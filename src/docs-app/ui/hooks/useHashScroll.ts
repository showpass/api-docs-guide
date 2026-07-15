import { useEffect } from "react";

function getDecodedHashId(): string | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  try {
    return decodeURIComponent(hash);
  } catch {
    // Malformed URL fragments should not break the documentation shell.
    return null;
  }
}

/**
 * Hook that handles scrolling to hash locations on page load and hash changes
 * 
 * @param offset - Offset from the top to account for fixed headers
 * @param ready - Wait until asynchronous page content has rendered
 * @param documentKey - Re-run initial positioning when the route document changes
 */
export function useHashScroll(
  offset: number = 100,
  ready = true,
  documentKey?: string
): void {
  useEffect(() => {
    if (!ready) {
      return;
    }

    let frame = 0;
    let cancelled = false;
    let userIntervened = false;
    const timers: number[] = [];

    const scrollToHash = (behavior: ScrollBehavior) => {
      const id = getDecodedHashId();
      if (!id) return;

      frame = window.requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (!element) return;

        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - offset,
          behavior,
        });
      });
    };

    const handleHashChange = () => {
      scrollToHash("smooth");
    };

    const cancelInitialStabilization = () => {
      userIntervened = true;
    };

    // Content is now mounted, so initial deep links can be positioned reliably.
    if (window.location.hash) {
      const initialHash = window.location.hash;
      const stabilizeInitialPosition = () => {
        if (
          !cancelled &&
          !userIntervened &&
          window.location.hash === initialHash
        ) {
          scrollToHash("auto");
        }
      };

      scrollToHash("auto");
      timers.push(window.setTimeout(stabilizeInitialPosition, 100));
      timers.push(window.setTimeout(stabilizeInitialPosition, 400));
      document.fonts?.ready.then(stabilizeInitialPosition);
    }

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("keydown", cancelInitialStabilization);
    window.addEventListener("pointerdown", cancelInitialStabilization);
    window.addEventListener("touchstart", cancelInitialStabilization, {
      passive: true,
    });
    window.addEventListener("wheel", cancelInitialStabilization, {
      passive: true,
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("keydown", cancelInitialStabilization);
      window.removeEventListener("pointerdown", cancelInitialStabilization);
      window.removeEventListener("touchstart", cancelInitialStabilization);
      window.removeEventListener("wheel", cancelInitialStabilization);
    };
  }, [documentKey, offset, ready]);
}

export default useHashScroll;
