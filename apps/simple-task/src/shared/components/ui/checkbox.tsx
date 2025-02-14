'use client'

import * as React from 'react'
import { Circle, Check } from 'lucide-react'
import { cn } from '@/shared/helpers/cn'

interface CheckboxProps extends React.HTMLAttributes<HTMLButtonElement> {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
	({ checked = false, onCheckedChange, className, ...props }, ref) => {
		return (
			<button
				ref={ref}
				role="checkbox"
				aria-checked={checked}
				onClick={() => onCheckedChange?.(!checked)}
				className={cn(
					'h-4 w-4 rounded-full border border-gray-600 flex items-center justify-center',
					'hover:border-gray-400 transition-colors',
					checked && 'bg-[#2D2E3D] border-[#2D2E3D]',
					className
				)}
				{...props}
			>
				{checked ? (
					<Check className="h-3 w-3 text-white" />
				) : (
					<Circle className="h-2 w-2 text-transparent" />
				)}
			</button>
		)
	}
)
Checkbox.displayName = 'Checkbox'
