'use client'

import { ColorPicker, Label } from 'ui'
import { useState } from 'react'

function CategoryForm() {
	const [selectedColor, setSelectedColor] = useState('#ef4444')

	return (
		<form>
			<div className="space-y-2">
				<Label>Color</Label>
				<ColorPicker
					value={selectedColor}
					onChange={setSelectedColor}
				/>
			</div>
		</form>
	)
}

export default CategoryForm
