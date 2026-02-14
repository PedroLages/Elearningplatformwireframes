import type { Resource } from '@/data/types'

const MEDIA_BASE = '/media'
const COURSES_ROOT = '/Volumes/SSD/GFX/Chase Hughes - The Operative Kit'

export function getResourceUrl(resource: Resource): string {
  return filePathToUrl(resource.filePath)
}

export function filePathToUrl(filePath: string): string {
  const relative = filePath.replace(COURSES_ROOT, '')
  return `${MEDIA_BASE}${relative}`
}

export function getVideoUrl(filePath: string): string {
  return filePathToUrl(filePath)
}

export function getPdfUrl(filePath: string): string {
  return filePathToUrl(filePath)
}

export { COURSES_ROOT, MEDIA_BASE }
