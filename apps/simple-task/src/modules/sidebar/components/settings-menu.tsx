import * as React from 'react'
import { Settings } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'ui'
import { ShortcutRecorder } from './shortcut-recorder'
import { useSettingsStore } from '../../quick-task/state/settings'
import { Button } from 'ui'

export function SettingsMenu() {
	const [isRecording, setIsRecording] = React.useState(false)
	const { shortcuts, setShortcut } = useSettingsStore()

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<Settings className="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Settings</SheetTitle>
				</SheetHeader>

				<div className="py-6">
					<h3 className="text-sm font-medium mb-4">
						Keyboard Shortcuts
					</h3>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								New Task
							</span>
							<ShortcutRecorder
								value={shortcuts.newTask}
								isRecording={isRecording}
								onStartRecording={() => setIsRecording(true)}
								onStopRecording={(shortcut) => {
									setIsRecording(false)
									if (shortcut) {
										setShortcut('newTask', shortcut)
									}
								}}
							/>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
