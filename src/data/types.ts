export type CourseCategory =
  | 'behavioral-analysis'
  | 'influence-authority'
  | 'confidence-mastery'
  | 'operative-training'
  | 'research-library'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type ResourceType = 'video' | 'pdf' | 'audio' | 'image' | 'markdown'

export interface CaptionTrack {
  src: string
  label: string
  language: string
  default?: boolean
}

export interface Resource {
  id: string
  title: string
  type: ResourceType
  filePath: string
  fileName: string
  metadata?: {
    captions?: CaptionTrack[]
    duration?: number
  }
}

export interface Lesson {
  id: string
  title: string
  description: string
  order: number
  resources: Resource[]
  keyTopics: string[]
  duration?: string
}

export interface Module {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  shortTitle: string
  description: string
  category: CourseCategory
  difficulty: Difficulty
  totalLessons: number
  totalVideos: number
  totalPDFs: number
  estimatedHours: number
  tags: string[]
  coverImage?: string
  modules: Module[]
  isSequential: boolean
  basePath: string
}

export interface Note {
  id: string
  content: string // Markdown text
  timestamp?: number // Video position when created (in seconds)
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
  tags: string[] // Extracted from #hashtags in content
}
