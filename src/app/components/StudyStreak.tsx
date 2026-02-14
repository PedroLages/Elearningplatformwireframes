import { Card, CardContent } from '@/app/components/ui/card'
import { Flame } from 'lucide-react'

interface StudyStreakProps {
  current: number
  longest: number
}

export function StudyStreak({ current, longest }: StudyStreakProps) {
  const getMessage = () => {
    if (current === 0) return 'Start your streak today!'
    if (current === 1) return 'Great start!'
    if (current < 7) return 'Keep it up!'
    if (current < 30) return "You're on fire!"
    return 'Unstoppable! 🏆'
  }

  const getFlameSize = () => {
    if (current >= 30) return 'w-12 h-12'
    if (current >= 7) return 'w-10 h-10'
    return 'w-8 h-8'
  }

  return (
    <Card className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 border-2 border-orange-200 dark:border-orange-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center transition-all duration-300 ${getFlameSize()}`}
          >
            <Flame className="w-full h-full text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground">Study Streak</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-500">
              {current} {current === 1 ? 'day' : 'days'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{getMessage()}</p>
            {longest > current && (
              <p className="text-xs text-muted-foreground">Longest: {longest} days</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
