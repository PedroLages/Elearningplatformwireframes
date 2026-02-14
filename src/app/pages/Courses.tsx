import { useState, useMemo } from 'react'
import { Card } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { CourseCard } from '@/app/components/figma/CourseCard'
import { Search } from 'lucide-react'
import { allCourses } from '@/data/courses'
import { getCourseCompletionPercent } from '@/lib/progress'
import type { CourseCategory } from '@/data/types'

const tabs: { value: string; label: string; category?: CourseCategory }[] = [
  { value: 'all', label: 'All Courses' },
  { value: 'behavioral-analysis', label: 'Behavioral Analysis', category: 'behavioral-analysis' },
  { value: 'influence-authority', label: 'Influence & Authority', category: 'influence-authority' },
  { value: 'confidence-mastery', label: 'Confidence', category: 'confidence-mastery' },
  { value: 'operative-training', label: 'Operative Training', category: 'operative-training' },
  { value: 'research-library', label: 'Research Library', category: 'research-library' },
]

export function Courses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filtered = useMemo(() => {
    let courses = allCourses

    const tab = tabs.find(t => t.value === activeTab)
    if (tab?.category) {
      courses = courses.filter(c => c.category === tab.category)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      courses = courses.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    return courses
  }, [activeTab, searchQuery])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">All Courses</h1>
        <p className="text-muted-foreground">
          Chase Hughes — The Operative Kit ({allCourses.length} courses)
        </p>
      </div>

      <Card className="bg-card rounded-3xl border-0 shadow-sm p-6 mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for courses..."
              aria-label="Search courses"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setSearchQuery('')}>
            {searchQuery ? 'Clear' : 'Search'}
          </Button>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex-wrap">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No courses match your search
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    completionPercent={getCourseCompletionPercent(course.id, course.totalLessons)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
