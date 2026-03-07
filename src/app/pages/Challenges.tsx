import { useEffect, useState } from 'react'
import { Plus, Target, Clock, Flame, Trophy } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Progress } from '@/app/components/ui/progress'
import { useChallengeStore } from '@/stores/useChallengeStore'
import { CreateChallengeDialog } from '@/app/components/challenges/CreateChallengeDialog'
import type { Challenge, ChallengeType } from '@/data/types'

const typeConfig: Record<ChallengeType, { label: string; unit: string; icon: typeof Target }> = {
  completion: { label: 'Completion', unit: 'videos', icon: Trophy },
  time: { label: 'Time', unit: 'hours', icon: Clock },
  streak: { label: 'Streak', unit: 'days', icon: Flame },
}

function formatDeadline(deadline: string): string {
  const date = new Date(deadline)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysRemaining(deadline: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const end = new Date(deadline)
  end.setHours(0, 0, 0, 0)
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const config = typeConfig[challenge.type]
  const Icon = config.icon
  const remaining = daysRemaining(challenge.deadline)
  const isExpired = remaining < 0
  const progressPercent = Math.min(
    100,
    challenge.targetValue > 0
      ? Math.round((challenge.currentProgress / challenge.targetValue) * 100)
      : 0
  )

  return (
    <Card className={isExpired ? 'opacity-60' : ''}>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-tight">{challenge.name}</h3>
              <p className="text-muted-foreground text-xs">
                {challenge.targetValue} {config.unit}
              </p>
            </div>
          </div>
          <Badge variant={isExpired ? 'secondary' : 'outline'} className="shrink-0 text-xs">
            {config.label}
          </Badge>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {challenge.currentProgress} / {challenge.targetValue} {config.unit}
            </span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <p className="text-muted-foreground text-xs">
          {isExpired
            ? 'Expired'
            : remaining === 0
              ? 'Deadline is today'
              : `${remaining} day${remaining !== 1 ? 's' : ''} remaining`}{' '}
          &middot; Due {formatDeadline(challenge.deadline)}
        </p>
      </CardContent>
    </Card>
  )
}

export function Challenges() {
  const { challenges, isLoading, loadChallenges } = useChallengeStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadChallenges()
  }, [loadChallenges])

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Challenges</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create Challenge
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground py-12 text-center text-sm">
          Loading challenges...
        </div>
      ) : challenges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
              <Target className="text-muted-foreground h-7 w-7" />
            </div>
            <div className="text-center">
              <h2 className="text-base font-semibold">No challenges yet</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Create your first challenge to set concrete learning goals.
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Create Challenge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {challenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}

      <CreateChallengeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
