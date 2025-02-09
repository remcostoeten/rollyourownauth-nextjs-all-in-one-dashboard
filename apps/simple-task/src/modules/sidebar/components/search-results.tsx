import { motion, AnimatePresence } from 'framer-motion'
import {  FileTextIcon } from 'lucide-react'
import { cn } from '@/src/shared/helpers/cn'
import { ListsIcon } from '@/src/components/icons'

interface SearchResult {
  type: 'task' | 'list'
  id: string
  title: string
  parentListId?: string
  matchedOn: 'title' | 'description' | 'listName'
  preview?: string
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  onSelect: (result: SearchResult) => void
}

function highlightMatch(text: string, query: string) {
  if (!query) return text

  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? 
      <span key={i} className="bg-primary/10 text-foreground font-medium">{part}</span> : 
      part
  )
}

export function SearchResults({ results, query, onSelect }: SearchResultsProps) {
  if (!query.trim()) return null

  return (
    <AnimatePresence>
      <div className="px-3 py-2">
        {results.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground text-center py-4"
          >
            No results found for &quot;{query}&quot;
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1"
          >
            {results.map((result) => (
              <motion.button
                key={`${result.id}-${result.matchedOn}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-sm',
                  'flex items-start gap-3 group transition-colors',
                  'hover:bg-primary/5 focus:bg-primary/5',
                  'focus:outline-none focus:ring-1 focus:ring-primary/20'
                )}
                onClick={() => onSelect(result)}
              >
                {result.type === 'list' ? (
                  <ListsIcon className="w-4 h-4 mt-1 text-muted-foreground" />
                ) : (
                  <FileTextIcon className="w-4 h-4 mt-1 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate group-hover:text-foreground">
                    {highlightMatch(result.title, query)}
                  </p>
                  {result.preview && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {highlightMatch(result.preview, query)}
                    </p>
                  )}
                  {result.parentListId && (
                    <p className="text-xs text-muted-foreground mt-0.5 opacity-60">
                      in List
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
} 