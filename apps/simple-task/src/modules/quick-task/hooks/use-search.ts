import { useState, useEffect, useMemo } from 'react'
import { useListStore } from '../store/lists'
import type { Task } from '../types/task'
import type { List } from '../store/lists'

interface SearchResult {
  type: 'task' | 'list'
  id: string
  title: string
  parentListId?: string
  matchedOn: 'title' | 'description' | 'listName'
  preview?: string
}

export function useSearch(query: string) {
  const { lists } = useListStore()
  const [results, setResults] = useState<SearchResult[]>([])

  const searchableContent = useMemo(() => {
    return lists.reduce<SearchResult[]>((acc, list) => {
      // Add list itself as a searchable item
      acc.push({
        type: 'list',
        id: list.id,
        title: list.title,
        matchedOn: 'title'
      })

      // Add all tasks from the list
      list.tasks.forEach(task => {
        acc.push({
          type: 'task',
          id: task.id,
          title: task.title,
          parentListId: list.id,
          matchedOn: 'title'
        })

        // If task has description, add it as searchable content
        if (task.description) {
          acc.push({
            type: 'task',
            id: task.id,
            title: task.title,
            parentListId: list.id,
            matchedOn: 'description',
            preview: task.description
          })
        }
      })

      return acc
    }, [])
  }, [lists])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTerms = query.toLowerCase().split(' ').filter(Boolean)
    
    const filteredResults = searchableContent.filter(item => {
      const matchesTitle = searchTerms.every(term => 
        item.title.toLowerCase().includes(term)
      )

      const matchesDescription = item.preview && searchTerms.every(term =>
        item.preview!.toLowerCase().includes(term)
      )

      return matchesTitle || matchesDescription
    })

    // Deduplicate results by ID while keeping the best match
    const uniqueResults = filteredResults.reduce<SearchResult[]>((acc, current) => {
      const existingIndex = acc.findIndex(item => item.id === current.id)
      
      if (existingIndex === -1) {
        acc.push(current)
      } else if (current.matchedOn === 'title' && acc[existingIndex].matchedOn !== 'title') {
        // Prefer title matches over description matches
        acc[existingIndex] = current
      }

      return acc
    }, [])

    // Sort results: title matches first, then by type (tasks before lists)
    const sortedResults = uniqueResults.sort((a, b) => {
      if (a.matchedOn === 'title' && b.matchedOn !== 'title') return -1
      if (a.matchedOn !== 'title' && b.matchedOn === 'title') return 1
      if (a.type === 'task' && b.type === 'list') return -1
      if (a.type === 'list' && b.type === 'task') return 1
      return 0
    })

    setResults(sortedResults)
  }, [query, searchableContent])

  return results
} 