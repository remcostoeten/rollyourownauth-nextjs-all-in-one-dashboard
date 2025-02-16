/**
 * @author Remco Stoeten
 * @description Utility component for centering children using grid, absolute, or flex positioning.
 */

import { ReactNode } from 'react'
import { cn } from 'helpers'

type CenterProps = {
	children: ReactNode
	method?: 'grid' | 'absolute' | 'flex'
	direction?: 'vertical' | 'horizontal' | 'both'
	className?: string
	isFullScreen?: boolean
}

export function Center({
	children,
	method = 'flex',
	direction = 'both',
	className = '',
	isFullScreen = false
}: CenterProps) {
	const baseStyles = {
		grid: 'grid w-screen h-screen place-items-center',
		absolute: cn(
			'absolute',
			isFullScreen && 'w-screen h-screen ',
			(direction === 'vertical' || direction === 'both') &&
				'top-1/2 -translate-y-1/2',
			(direction === 'horizontal' || direction === 'both') &&
				'left-1/2 -translate-x-1/2'
		),
		flex: cn(
			'flex',
			(direction === 'vertical' || direction === 'both') &&
				'items-center',
			(direction === 'horizontal' || direction === 'both') &&
				'justify-center'
		)
	}

	return <div className={cn(baseStyles[method], className)}>{children}</div>
}
