import type { ReactNode } from 'react'

declare global {
  /**
   * Generic type for page components.
   *
   * @template P - Optional props for the page (default: `Record<string, unknown>`).
   * @property {ReactNode} children - The child components or elements inside the page.
   */
  type PageProps<P = Record<string, unknown>> = P & {
    children: ReactNode
  }

  // Use 'object' instead of '{}' for "any object" type
  type AnyObject = object;

  // Use 'Record<string, unknown>' for a more specific object type
  type GenericObject = Record<string, unknown>;

  // Use 'unknown' for "any value" type
  type AnyValue = unknown;

  // Add other global types here
  interface Window {
    ENV: {
      NODE_ENV: string;
      DATABASE_URL: string;
    }
  }
}

export {}