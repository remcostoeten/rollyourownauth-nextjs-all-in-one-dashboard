import * as React from 'react'
import { Check } from 'lucide-react'

const COLORS = [
	'#ef4444', // red
	'#f97316', // orange
	'#f59e0b', // amber
	'#84cc16', // lime
	'#22c55e', // green
	'#06b6d4', // cyan
	'#3b82f6', // blue
	'#6366f1', // indigo
	'#a855f7', // purple
	'#ec4899', // pink
	'#64748b', // slate
	'#292524' // stone
]

type ColorPickerProps = {
	value: string
	onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
	return (
		<div className="grid grid-cols-6 gap-2 p-2">
			{COLORS.map((color) => (
				<button
					key={color}
					className="group relative aspect-square rounded-full p-0.5 outline-none 
                     focus-visible:ring-2 focus-visible:ring-offset-2"
					onClick={() => onChange(color)}
					style={{ backgroundColor: color }}
				>
					{value === color && (
						<Check
							className="h-full w-full text-primary-foreground 
                         stroke-[4] absolute inset-0 m-auto"
							size={14}
						/>
					)}
					<span className="sr-only">Select color: {color}</span>
				</button>
			))}
		</div>
	)
}
