/**
 * @author Remco Stoeten
 * @description A flexible layout component that provides a simple API for building
 * complex flex-based layouts with support for various flex properties and spacing variants
 */

import React from 'react'
import { cn } from 'helpers'

type SpaceSize = 'xs' | 's' | 'm' | 'l' | 'xl'
type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse'
type FlexWrap = 'wrap' | 'wrap-reverse' | 'nowrap'
type JustifyContent =
	| 'start'
	| 'end'
	| 'center'
	| 'between'
	| 'around'
	| 'evenly'
type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
type AlignContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
type FlexVariant =
	| 'default'
	| 'center'
	| `space-x-${SpaceSize}`
	| `space-y-${SpaceSize}`

const spaceToGap: Record<SpaceSize, string> = {
	xs: '2',
	s: '4',
	m: '6',
	l: '8',
	xl: '10'
} as const

const variantClasses: Record<FlexVariant, string> = {
	default: '',
	center: 'items-center justify-center',
	'space-x-xs': `items-center space-x-${spaceToGap.xs}`,
	'space-x-s': `items-center space-x-${spaceToGap.s}`,
	'space-x-m': `items-center space-x-${spaceToGap.m}`,
	'space-x-l': `items-center space-x-${spaceToGap.l}`,
	'space-x-xl': `items-center space-x-${spaceToGap.xl}`,
	'space-y-xs': `flex-col items-center space-y-${spaceToGap.xs}`,
	'space-y-s': `flex-col items-center space-y-${spaceToGap.s}`,
	'space-y-m': `flex-col items-center space-y-${spaceToGap.m}`,
	'space-y-l': `flex-col items-center space-y-${spaceToGap.l}`,
	'space-y-xl': `flex-col items-center space-y-${spaceToGap.xl}`
} as const

export const Flex = <T extends React.ElementType = 'div'>({
	as,
	direction,
	wrap,
	justify,
	items,
	content,
	gap,
	variant = 'default',
	children,
	role,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	'data-testid': dataTestId,
	className,
	key,
	...props
}: FlexProps<T>) => {
	const Component = as || 'div'

	const classes = cn(
		'flex',
		variantClasses[variant],
		direction && `flex-${direction}`,
		wrap && `flex-${wrap}`,
		justify && `justify-${justify}`,
		items && `items-${items}`,
		content && `content-${content}`,
		gap !== undefined && `gap-${gap}`,
		className
	)

	return (
		<Component
			className={classes}
			role={role}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			data-testid={dataTestId}
			key={key}
			{...props}
		>
			{children}
		</Component>
	)
}

interface FlexProps<T extends React.ElementType = 'div'>
	extends React.HTMLAttributes<HTMLElement> {
	/** The HTML element to render as */
	as?: T
	/** Flex direction property */
	direction?: FlexDirection
	/** Flex wrap property */
	wrap?: FlexWrap
	/** Justify content property */
	justify?: JustifyContent
	/** Align items property */
	items?: AlignItems
	/** Align content property */
	content?: AlignContent
	/** Gap between items */
	gap?: number | string
	/** Predefined layout variants */
	variant?: FlexVariant
	/** Additional CSS classes */
	className?: string
	/** ARIA role */
	role?: string
	/** ARIA label */
	'aria-label'?: string
	/** ARIA labelledby */
	'aria-labelledby'?: string
	/** Test ID for testing */
	'data-testid'?: string
	/** Key prop */
	key?: React.Key
}
