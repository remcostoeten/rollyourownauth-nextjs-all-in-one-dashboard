"use client"

import { Slider } from "@/components/ui/slider"
import { useState, useEffect, useCallback } from "react"
import { useLocationStore } from "../store/locationStore"

export const TimelineSlider = () => {
  const [value, setValue] = useState(100)
  const { locations, setDateFilter } = useLocationStore()

  const getDateFromPercentage = useCallback(
    (percentage: number) => {
      const oldestDate = new Date(Math.min(...locations.map((loc) => new Date(loc.dateAdded).getTime())))
      const newestDate = new Date(Math.max(...locations.map((loc) => new Date(loc.dateAdded).getTime())))
      const totalMilliseconds = newestDate.getTime() - oldestDate.getTime()
      const milliseconds = totalMilliseconds * (percentage / 100)
      return new Date(oldestDate.getTime() + milliseconds)
    },
    [locations],
  )

  useEffect(() => {
    const date = getDateFromPercentage(value)
    setDateFilter(date)
  }, [value, getDateFromPercentage, setDateFilter])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#121212] border-t border-[#1f1f1f]">
      <Slider
        value={[value]}
        onValueChange={(vals) => setValue(vals[0])}
        max={100}
        step={1}
        className="w-full [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:bg-[#00F8E0]"
      />
      <div className="flex justify-between mt-2 text-xs text-[#666]">
        <span>{formatDate(getDateFromPercentage(0))}</span>
        <span>{formatDate(getDateFromPercentage(value))}</span>
        <span>{formatDate(getDateFromPercentage(100))}</span>
      </div>
    </div>
  )
}

