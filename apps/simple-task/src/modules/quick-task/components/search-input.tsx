import { Search } from 'lucide-react'

interface SearchInputProps {
	onSearch: (query: string) => void
}

export function SearchInput({ onSearch }: SearchInputProps) {
	return (
		<div className="flex-1 relative">
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
			<input
				type="text"
				placeholder="Search tasks... "
				className="w-full bg-secondary/30 border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
				onChange={(e) => onSearch(e.target.value)}
			/>
		</div>
	)
}
