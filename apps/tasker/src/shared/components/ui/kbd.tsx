import { cn } from '@/shared/helpers'

interface KbdProps extends React.HTMLAttributes<HTMLSpanElement> {
	children: React.ReactNode
}

export function Kbd({ children, className, ...props }: KbdProps) {
	return (
		<span
			className={cn(
				'px-1.5 py-0.5 text-xs font-mono bg-secondary text-muted-foreground border border-border rounded',
				className
			)}
			{...props}
		>
			{children}
		</span>
	)
}
