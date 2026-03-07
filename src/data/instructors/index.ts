import type { Instructor } from '@/data/types'

import { chaseHughes } from './chase-hughes'

export { chaseHughes }

export const allInstructors: Instructor[] = [chaseHughes]

export function getInstructorById(id: string): Instructor | undefined {
  return allInstructors.find(i => i.id === id)
}
