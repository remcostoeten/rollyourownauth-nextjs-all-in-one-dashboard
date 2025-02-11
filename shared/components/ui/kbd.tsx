import {
	motion,
	AnimationControls,
	TargetAndTransition,
	VariantLabels,
	Variants,
	Transition
} from 'framer-motion'
import { cn } from 'helpers'
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'

type KbdProps = {
	children: React.ReactNode
	className?: string
	animate?: AnimationControls | TargetAndTransition | VariantLabels | boolean
	framerMotion?: boolean
	variants?: Variants
	transition?: Transition
}

export function Kbd({
	children,
	variants,
	transition,
	className,
	animate,
	framerMotion
}: KbdProps) {
	const kbdClassNames = cn(
		'inline-flex items-center justify-center',
		'rounded border border-border bg-muted px-1.5 font-[10px]',
		'font-mono font-medium text-muted-foreground',
		'h-5 min-w-[20px]',
		'relative overflow-hidden', // Required for the shimmer effect
		'hover:bg-shimmer', // Add a class for hover effect
		className
	)

	const kbd = framerMotion ? (
		<motion.kbd
			className={kbdClassNames}
			animate={animate}
			variants={variants}
			transition={transition}
		>
			{children}
			<div className="shimmer"></div>
		</motion.kbd>
	) : (
		<kbd className={kbdClassNames}>
			{children}
			<div className="shimmer"></div> {/* Shimmer effect element */}
		</kbd>
	)

	return (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<div>{kbd}</div>
			</TooltipTrigger>
			<TooltipContent>
				<p className="text-xs">Keyboard shortcut</p>
			</TooltipContent>
		</Tooltip>
	)
}
