import { useState, useEffect, useCallback, useRef } from 'react'
import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight, Snowflake, BookOpen } from 'lucide-react'
import { Popover, PopoverContent, PopoverAnchor } from '@/app/components/ui/popover'
import { buttonVariants } from '@/app/components/ui/button'
import { cn } from '@/app/components/ui/utils'
import { getMonthStudyData, type DayStudyData } from '@/lib/studyCalendar'
import { toLocalDateString } from '@/lib/dateUtils'
import { allCourses } from '@/data/courses'

const courseNameMap = new Map(allCourses.map(c => [c.id, c.title]))

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function actionLabel(type: string): string {
  switch (type) {
    case 'lesson_complete':
      return 'Completed lesson'
    case 'video_progress':
      return 'Watched video'
    case 'note_saved':
      return 'Saved note'
    case 'course_started':
      return 'Started course'
    case 'pdf_progress':
      return 'Read PDF'
    default:
      return type
  }
}

export function StudyHistoryCalendar() {
  const [month, setMonth] = useState(() => new Date())
  const [studyData, setStudyData] = useState<Map<string, DayStudyData>>(new Map())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const refreshData = useCallback(() => {
    const data = getMonthStudyData(month.getFullYear(), month.getMonth() + 1)
    setStudyData(data)
  }, [month])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Live updates when study log changes
  useEffect(() => {
    const handler = () => refreshData()
    window.addEventListener('study-log-updated', handler)
    return () => window.removeEventListener('study-log-updated', handler)
  }, [refreshData])

  const handleDayClick = (day: Date, _modifiers: unknown, e: React.MouseEvent) => {
    // Position the popover anchor at the clicked day cell
    const btn = (e.target as HTMLElement).closest('button')
    if (btn && anchorRef.current) {
      const calRect = anchorRef.current.parentElement!.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      anchorRef.current.style.position = 'absolute'
      anchorRef.current.style.left = `${btnRect.left - calRect.left + btnRect.width / 2}px`
      anchorRef.current.style.top = `${btnRect.bottom - calRect.top}px`
    }
    setSelectedDay(day)
    setPopoverOpen(true)
  }

  const selectedDayData = selectedDay ? studyData.get(toLocalDateString(selectedDay)) : null

  return (
    <div data-testid="study-history-calendar" className="relative">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverAnchor asChild>
          <div ref={anchorRef} className="pointer-events-none" />
        </PopoverAnchor>
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          showOutsideDays={false}
          onDayClick={handleDayClick}
          classNames={{
            months: 'flex flex-col gap-2',
            month: 'flex flex-col gap-4',
            month_caption: 'flex justify-center pt-1 relative items-center w-full',
            caption_label: 'text-sm font-medium',
            nav: 'flex items-center gap-1',
            button_previous: cn(
              buttonVariants({ variant: 'outline' }),
              'absolute left-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            ),
            button_next: cn(
              buttonVariants({ variant: 'outline' }),
              'absolute right-1 size-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            ),
            month_grid: 'w-full border-collapse',
            weekdays: 'flex',
            weekday:
              'text-muted-foreground flex-1 min-w-[44px] font-normal text-[0.8rem] text-center',
            week: 'flex w-full mt-1',
            day: 'relative flex-1 min-w-[44px] min-h-[44px] p-0 text-center text-sm focus-within:relative focus-within:z-20',
            day_button: cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full min-w-[44px] min-h-[44px] p-0 font-normal rounded-md aria-selected:opacity-100'
            ),
            selected:
              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
            today: 'bg-accent text-accent-foreground',
            outside: 'text-muted-foreground',
            disabled: 'text-muted-foreground opacity-50',
            hidden: 'invisible',
          }}
          components={{
            Chevron: ({ orientation, ...chevronProps }) => {
              const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
              return <Icon className="size-4" {...chevronProps} />
            },
            DayButton: ({ day, modifiers, className, ...props }) => {
              const dateStr = toLocalDateString(day.date)
              const dayData = studyData.get(dateStr)
              const hasActivity = (dayData?.sessions.length ?? 0) > 0
              const isFreezeDay = !!(dayData?.isFreezeDay && !hasActivity)

              return (
                <button
                  {...props}
                  className={cn(
                    className,
                    hasActivity && 'bg-green-100 text-green-900 hover:bg-green-200',
                    isFreezeDay && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  )}
                  data-has-activity={String(hasActivity)}
                  data-freeze-day={isFreezeDay ? 'true' : undefined}
                >
                  <span className="relative flex flex-col items-center justify-center gap-0.5">
                    {day.date.getDate()}
                    {hasActivity && (
                      <span className="block size-1.5 rounded-full bg-green-600" aria-hidden="true" />
                    )}
                    {isFreezeDay && (
                      <Snowflake className="size-3 text-blue-500" aria-label="Freeze day" />
                    )}
                  </span>
                </button>
              )
            },
          }}
        />

        <PopoverContent
          data-testid="day-detail-popover"
          className="w-80"
          align="start"
          side="bottom"
        >
          {selectedDayData ? (
            selectedDayData.sessions.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">
                  {selectedDay?.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h4>
                <ul className="space-y-2">
                  {selectedDayData.sessions.map((session, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <BookOpen className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {courseNameMap.get(session.courseId) ?? session.courseId}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {actionLabel(session.type)} &middot; {formatTime(session.timestamp)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No study sessions on this day</p>
            )
          ) : (
            <p className="text-sm text-muted-foreground">No study sessions on this day</p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
