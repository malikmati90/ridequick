"use client"

import * as React from "react"
import { Clock, ChevronUp, ChevronDown } from "lucide-react"
import { format, parse, isAfter, isBefore, set } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMobile } from "@/hooks/use-mobile"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  hourRange?: { start: number; end: number }
  minuteInterval?: number
  defaultTimeFormat?: "12h" | "24h"
  styles?: {
    selectedBg?: string
    selectedText?: string
    saveButtonBg?: string
    saveButtonText?: string
  }
}

export function TimePicker({
  date,
  setDate,
  className,
  hourRange = { start: 0, end: 23 },
  minuteInterval = 5,
  defaultTimeFormat = "24h",
  styles = {
    selectedBg: "bg-primary",
    selectedText: "text-primary-foreground",
    saveButtonBg: "bg-primary",
    saveButtonText: "text-primary-foreground",
  },
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [timeFormat, setTimeFormat] = React.useState<"12h" | "24h">(defaultTimeFormat)
  const [period, setPeriod] = React.useState<"AM" | "PM">(
    date ? (date.getHours() >= 12 ? "PM" : "AM") : new Date().getHours() >= 12 ? "PM" : "AM",
  )
  const isMobile = useMobile()
  const [clockView, setClockView] = React.useState<"hours" | "minutes">("hours")
  const clockRef = React.useRef<HTMLDivElement>(null)

  // Generate hours array based on range and format
  const hours = React.useMemo(() => {
    const result = []
    const start = timeFormat === "12h" ? 1 : hourRange.start
    const end = timeFormat === "12h" ? 12 : hourRange.end

    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    return result
  }, [hourRange, timeFormat])

  // Generate minutes array based on interval
  const minutes = React.useMemo(() => {
    const result = []
    for (let i = 0; i < 60; i += minuteInterval) {
      result.push(i)
    }
    return result
  }, [minuteInterval])

  // Calculate visible hours and minutes (for scrolling)
  const [visibleHourIndex, setVisibleHourIndex] = React.useState(0)
  const [visibleMinuteIndex, setVisibleMinuteIndex] = React.useState(0)

  const visibleHours = hours.slice(visibleHourIndex, visibleHourIndex + 5)
  const visibleMinutes = minutes.slice(visibleMinuteIndex, visibleMinuteIndex + 5)

  const hasSetInitialScroll = React.useRef(false)

  React.useEffect(() => {
    if (hasSetInitialScroll.current) return
  
    if (!date) {
      const now = new Date()
      let currentHour = now.getHours()
      const currentMinute = now.getMinutes()
  
      if (timeFormat === "12h") {
        currentHour = currentHour % 12 || 12
      }
  
      const hourIndex = hours.findIndex((h) => h >= currentHour)
      const minuteIndex = minutes.findIndex((m) => m >= currentMinute)
  
      if (hourIndex !== -1) {
        setVisibleHourIndex(Math.max(0, Math.min(hourIndex - 2, hours.length - 5)))
      }
  
      if (minuteIndex !== -1) {
        setVisibleMinuteIndex(Math.max(0, Math.min(minuteIndex - 2, minutes.length - 5)))
      }
    } else {
      let hourValue = date.getHours()
  
      if (timeFormat === "12h") {
        hourValue = hourValue % 12 || 12
      }
  
      const minuteValue = date.getMinutes()
  
      const hourIndex = hours.findIndex((h) => h === hourValue)
      const minuteIndex = minutes.findIndex((m) => m === minuteValue)
  
      if (hourIndex !== -1) {
        setVisibleHourIndex(Math.max(0, Math.min(hourIndex - 2, hours.length - 5)))
      }
  
      if (minuteIndex !== -1) {
        setVisibleMinuteIndex(Math.max(0, Math.min(minuteIndex - 2, minutes.length - 5)))
      }
    }
  
    hasSetInitialScroll.current = true
  }, [date, hours, minutes, timeFormat])
  

  // Update period when date changes
  React.useEffect(() => {
    if (date) {
      setPeriod(date.getHours() >= 12 ? "PM" : "AM")
    }
  }, [date])

  const scrollHours = (direction: "up" | "down") => {
    if (direction === "up" && visibleHourIndex > 0) {
      setVisibleHourIndex((prev) => prev - 1)
    } else if (direction === "down" && visibleHourIndex < hours.length - 5) {
      setVisibleHourIndex((prev) => prev + 1)
    }
  }

  const scrollMinutes = (direction: "up" | "down") => {
    if (direction === "up" && visibleMinuteIndex > 0) {
      setVisibleMinuteIndex((prev) => prev - 1)
    } else if (direction === "down" && visibleMinuteIndex < minutes.length - 5) {
      setVisibleMinuteIndex((prev) => prev + 1)
    }
  }


  const handleTimeSelect = (hour: number | null, minute: number | null) => {
    const newDate = date ? new Date(date) : new Date()
    const currentHour = newDate.getHours()

    if (hour !== null) {
      // Convert from 12-hour to 24-hour if needed
      if (timeFormat === "12h") {
        if (period === "PM" && hour !== 12) {
          hour += 12
        } else if (period === "AM" && hour === 12) {
          hour = 0
        }
      }
      newDate.setHours(hour)
    }

    if (minute !== null) {
      newDate.setMinutes(minute)
    }

    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    setDate(newDate)

    // If we're in mobile clock view and just set the hour, switch to minutes
    if (isMobile && hour !== null && minute === null) {
      setClockView("minutes")
    }
  }

  const togglePeriod = () => {
    const newPeriod = period === "AM" ? "PM" : "AM"
    setPeriod(newPeriod)

    if (date) {
      const newDate = new Date(date)
      let hours = newDate.getHours()

      if (newPeriod === "AM" && hours >= 12) {
        // Convert from PM to AM
        hours -= 12
      } else if (newPeriod === "PM" && hours < 12) {
        // Convert from AM to PM
        hours += 12
      }

      newDate.setHours(hours)
      setDate(newDate)
    }
  }

  const handleSave = () => {
    setOpen(false)
  }

  const getDisplayTime = () => {
    if (!date) return "Select time"

    return timeFormat === "12h" ? format(date, "h:mm a") : format(date, "HH:mm")
  }

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clockRef.current) return

    const rect = clockRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate angle in radians
    const angle = Math.atan2(y - centerY, x - centerX)
    // Convert to degrees and adjust to start from 12 o'clock position
    let degrees = (angle * 180) / Math.PI + 90
    if (degrees < 0) degrees += 360

    if (clockView === "hours") {
      // For hours, divide the circle into 12 segments
      let hour = Math.round(degrees / 30) % 12
      hour = hour === 0 ? 12 : hour

      // Convert to 24-hour format if needed
      let hour24 = hour
      if (timeFormat === "24h") {
        // In 24h mode, we need to handle 0-23
        if (period === "PM" && hour !== 12) hour24 = hour + 12
        if (period === "AM" && hour === 12) hour24 = 0
      }

    } else {
      // For minutes, divide the circle into segments based on minuteInterval
      const minuteSegments = 60 / minuteInterval
      let minute = Math.round(degrees / (360 / minuteSegments)) * minuteInterval
      minute = minute === 60 ? 0 : minute

      // Get current hour in appropriate format
      let hour = date?.getHours() || 0
      if (timeFormat === "12h") {
        hour = hour % 12
        hour = hour === 0 ? 12 : hour
      }
    }
  }

  const toggleTimeFormat = () => {
    const newFormat = timeFormat === "24h" ? "12h" : "24h"
    setTimeFormat(newFormat)

    // Update the visible hours based on the new format
    if (date) {
      let hourValue = date.getHours()

      if (newFormat === "12h") {
        hourValue = hourValue % 12
        hourValue = hourValue === 0 ? 12 : hourValue
      }

      const hourIndex = hours.findIndex((h) => h === hourValue)
      if (hourIndex !== -1) {
        setVisibleHourIndex(Math.max(0, Math.min(hourIndex - 2, hours.length - 5)))
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          className={cn(
            "py-4 md:py-5 text-left font-normal bg-gray-50 border-gray-200 hover:bg-gray-100",
            !date && "text-muted-foreground",
            className
          )}
        >
          {getDisplayTime()}
          <Clock className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-3">
          {/* Format toggle */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b">
            <Label htmlFor="time-format" className="text-sm">
              {timeFormat === "24h" ? "24 hour clock format" : "12 hour format with AM/PM"}
            </Label>
            <div className="flex items-center space-x-2">
              <Switch id="time-format" checked={timeFormat === "12h"} onCheckedChange={() => toggleTimeFormat()} />
            </div>
          </div>

          {isMobile ? (
            // Mobile clock interface
            <div className="flex flex-col items-center">
              <div className="text-sm font-medium mb-2">{clockView === "hours" ? "Select Hour" : "Select Minute"}</div>

              {/* Clock face */}
              <div
                ref={clockRef}
                className="relative w-48 h-48 rounded-full border border-border mb-3"
                onClick={handleClockClick}
              >
                {/* Clock center */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2"></div>

                {/* Clock numbers */}
                {clockView === "hours"
                  ? // Hour numbers
                    hours.map((hour) => {
                      const isSelected =
                        date &&
                        (timeFormat === "24h"
                          ? date.getHours() === hour
                          : date.getHours() % 12 === hour % 12 &&
                            (hour === 12 ? date.getHours() === (period === "AM" ? 0 : 12) : true))

                      const angle = ((hour % 12) * 30 - 90) * (Math.PI / 180)
                      const radius = 20
                      const top = 50 + 40 * Math.sin(angle)
                      const left = 50 + 40 * Math.cos(angle)

                      return (
                        <div
                          key={hour}
                          className={cn(
                            "absolute w-6 h-6 flex items-center justify-center rounded-full text-sm",
                            isSelected && `${styles.selectedBg} ${styles.selectedText}`,
                          )}
                          style={{
                            top: `${top}%`,
                            left: `${left}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {hour}
                        </div>
                      )
                    })
                  : // Minute numbers (show only multiples of 5 for clarity)
                    minutes
                      .filter((m) => m % 5 === 0)
                      .map((minute) => {
                        const isSelected = date && date.getMinutes() === minute
                        const angle = (minute * 6 - 90) * (Math.PI / 180)
                        const top = 50 + 40 * Math.sin(angle)
                        const left = 50 + 40 * Math.cos(angle)

                        return (
                          <div
                            key={minute}
                            className={cn(
                              "absolute w-6 h-6 flex items-center justify-center rounded-full text-sm",
                              isSelected && `${styles.selectedBg} ${styles.selectedText}`,
                            )}
                            style={{
                              top: `${top}%`,
                              left: `${left}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {minute}
                          </div>
                        )
                      })}

                {/* Clock hand */}
                {date && (
                  <div
                    className={`absolute top-1/2 left-1/2 w-1 bg-primary rounded-full origin-bottom ${styles.selectedBg}`}
                    style={{
                      height: "40%",
                      transform: `rotate(${
                        clockView === "hours" ? (date.getHours() % 12) * 30 - 90 : date.getMinutes() * 6 - 90
                      }deg) translateX(-50%)`,
                      transformOrigin: "bottom center",
                    }}
                  ></div>
                )}
              </div>

              {/* View toggle buttons */}
              <div className="flex space-x-2 mb-3">
                <Button
                  variant={clockView === "hours" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setClockView("hours")}
                  className={clockView === "hours" ? cn(styles.selectedBg, styles.selectedText) : ""}
                >
                  Hours
                </Button>
                <Button
                  variant={clockView === "minutes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setClockView("minutes")}
                  className={clockView === "minutes" ? cn(styles.selectedBg, styles.selectedText) : ""}
                >
                  Minutes
                </Button>
              </div>

              {/* Time display */}
              <div className="text-2xl font-bold mb-3">{date ? getDisplayTime() : "--:--"}</div>

              {/* AM/PM toggle for 12h format */}
              {timeFormat === "12h" && (
                <div className="flex space-x-2 mb-3">
                  <Button
                    variant={period === "AM" ? "default" : "outline"}
                    size="sm"
                    onClick={() => period !== "AM" && togglePeriod()}
                    className={period === "AM" ? cn(styles.selectedBg, styles.selectedText) : ""}
                  >
                    AM
                  </Button>
                  <Button
                    variant={period === "PM" ? "default" : "outline"}
                    size="sm"
                    onClick={() => period !== "PM" && togglePeriod()}
                    className={period === "PM" ? cn(styles.selectedBg, styles.selectedText) : ""}
                  >
                    PM
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Desktop dropdown interface
            <div className="flex items-stretch">
              {/* Hours column */}
              <div className="flex-1 flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => scrollHours("up")}
                  disabled={visibleHourIndex <= 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>

                <div className="flex-1 flex flex-col space-y-1 py-1">
                  {visibleHours.map((hour) => {
                    // Convert displayed hour to 24-hour for comparison
                    let hour24 = hour
                    if (timeFormat === "12h") {
                      if (period === "PM" && hour !== 12) hour24 = hour + 12
                      if (period === "AM" && hour === 12) hour24 = 0
                    }

                    const isSelected =
                      date &&
                      (timeFormat === "24h"
                        ? date.getHours() === hour
                        : date.getHours() % 12 === hour % 12 &&
                          (hour === 12 ? date.getHours() === (period === "AM" ? 0 : 12) : true))

                    return (
                      <Button
                        key={hour}
                        variant="ghost"
                        className={cn(
                          "h-8 w-full rounded-md",
                          isSelected && `${styles.selectedBg} ${styles.selectedText}`,
                        )}
                        onClick={() => handleTimeSelect(hour24, null)}
                      >
                        {hour.toString().padStart(2, "0")}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => scrollHours("down")}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Divider */}
              <div className="w-px bg-border mx-2 my-1"></div>

              {/* Minutes column */}
              <div className="flex-1 flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => scrollMinutes("up")}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>

                <div className="flex-1 flex flex-col space-y-1 py-1">
                  {visibleMinutes.map((minute) => {
                    return (
                      <Button
                        key={minute}
                        variant="ghost"
                        className={cn(
                          "h-8 w-full rounded-md",
                          date && date.getMinutes() === minute && `${styles.selectedBg} ${styles.selectedText}`,
                        )}
                        onClick={() => handleTimeSelect(null, minute)}
                      >
                        {minute.toString().padStart(2, "0")}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => scrollMinutes("down")}
                  disabled={visibleMinuteIndex >= minutes.length - 5}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* AM/PM selector for 12h format */}
              {timeFormat === "12h" && (
                <>
                  <div className="w-px bg-border mx-2 my-1"></div>
                  <div className="flex flex-col items-center justify-center">
                    <Button
                      variant="ghost"
                      className={cn("h-8 px-2", period === "AM" && `${styles.selectedBg} ${styles.selectedText}`)}
                      onClick={togglePeriod}
                    >
                      AM
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn("h-8 px-2", period === "PM" && `${styles.selectedBg} ${styles.selectedText}`)}
                      onClick={togglePeriod}
                    >
                      PM
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          <Button className={cn("w-full mt-3", styles.saveButtonBg, styles.saveButtonText)} onClick={handleSave}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
