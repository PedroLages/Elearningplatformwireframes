import type { Course } from '@/data/types'

import { nciAccess } from './nci-access'
import { authority } from './authority'
import { confidenceReboot } from './confidence-reboot'
import { sixMinuteXRay } from './6mx'
import { operativeSix } from './operative-six'
import { behaviorSkillsCourse } from './behavior-skills'
import { opsManualCourse } from './ops-manual'
import { studyMaterialsCourse } from './study-materials'

export {
  nciAccess,
  authority,
  confidenceReboot,
  sixMinuteXRay,
  operativeSix,
  behaviorSkillsCourse,
  opsManualCourse,
  studyMaterialsCourse,
}

export const allCourses: Course[] = [
  nciAccess,
  authority,
  confidenceReboot,
  sixMinuteXRay,
  operativeSix,
  behaviorSkillsCourse,
  opsManualCourse,
  studyMaterialsCourse,
]
