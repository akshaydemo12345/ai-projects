import { useEffect, RefObject } from 'react';
import { executeScripts } from '../lib/embed-utils';

/**
 * Hook to automatically execute scripts within a container after it mounts or updates.
 * Useful for form embeds that contain <script> tags.
 */
export function useExecuteEmbedScripts(containerRef: RefObject<HTMLElement>, dependencies: any[] = []) {
  useEffect(() => {
    if (containerRef.current) {
      executeScripts(containerRef.current);
    }
  }, [containerRef, ...dependencies]);
}
