import * as React from 'react'
import { cn } from 'helpers'
import { Button } from 'ui'
import { Check, X } from 'lucide-react'

interface ShortcutRecorderProps {
	value: string
	isRecording: boolean
	onStartRecording: () => void
	onStopRecording: (shortcut: string | null) => void
	className?: string
}

export function ShortcutRecorder({
	value,
	isRecording,
	onStartRecording,
	onStopRecording,
	className
}: ShortcutRecorderProps) {
	const [currentKeys, setCurrentKeys] = React.useState<string[]>([])

	React.useEffect(() => {
		if (!isRecording) return

		const handleKeyDown = (e: KeyboardEvent) => {
			e.preventDefault()

			const key = e.key.toLowerCase()
			if (
				key === 'meta' ||
				key === 'alt' ||
				key === 'control' ||
				key === 'shift'
			)
				return

			const modifiers = [
				e.ctrlKey && 'Ctrl',
				e.metaKey && 'Meta',
				e.altKey && 'Alt',
				e.shiftKey && 'Shift'
			].filter(Boolean) as string[]

			const newKeys = [...modifiers, key.toUpperCase()]
			setCurrentKeys(newKeys)
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isRecording])

	const displayValue = isRecording
		? currentKeys.length > 0
			? currentKeys.join(' + ')
			: 'Type shortcut...'
		: value

	return (
		<div className={cn('flex items-center gap-2', className)}>
			<button
				onClick={onStartRecording}
				className={cn(
					'px-3 py-1.5 rounded-md border border-border text-sm font-mono',
					'hover:bg-accent hover:text-accent-foreground',
					isRecording &&
						'bg-accent text-accent-foreground border-primary'
				)}
			>
				{displayValue}
			</button>

			{isRecording && (
				<div className="flex items-center gap-1">
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7"
						onClick={() => {
							onStopRecording(currentKeys.join('+'))
							setCurrentKeys([])
						}}
					>
						<Check className="h-4 w-4" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7"
						onClick={() => {
							onStopRecording(null)
							setCurrentKeys([])
						}}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	)
}
