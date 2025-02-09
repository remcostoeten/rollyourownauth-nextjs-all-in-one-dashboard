import type { ReactNode } from 'react'

declare global {
	/**
	 * Generic type for page components.
	 *
	 * @template P - Optional props for the page (default: `object`).
	 * @property {ReactNode} children - The child components or elements inside the page.
	 */
	type PageProps<P = object> = P & {
		children: ReactNode
	}
}

export {}
