import React from 'react'
import { cn } from '../../helpers/cn'

export default function Kbd({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<kbd
			className={cn(
				'pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-sans text-[11px] opacity-100 sm:flex',
				className
			)}
		>
			{children}
		</kbd>
	)
}
