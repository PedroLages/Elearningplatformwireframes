export type CourseCategory =
  | "behavioral-analysis"
  | "influence-authority"
  | "confidence-mastery"
  | "operative-training"
  | "research-library"

export type Difficulty = "beginner" | "intermediate" | "advanced"

export type ResourceType = "video" | "pdf" | "audio" | "image" | "markdown"

export interface Resource {
  id: string
  title: string
  type: ResourceType
  filePath: string
  fileName: string
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
