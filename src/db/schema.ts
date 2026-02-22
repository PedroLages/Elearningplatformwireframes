import Dexie, { type EntityTable } from 'dexie'
import type { ImportedCourse, ImportedVideo, ImportedPdf, VideoProgress, VideoBookmark } from '@/data/types'

const db = new Dexie('ElearningDB') as Dexie & {
  importedCourses: EntityTable<ImportedCourse, 'id'>
  importedVideos: EntityTable<ImportedVideo, 'id'>
  importedPdfs: EntityTable<ImportedPdf, 'id'>
  progress: EntityTable<VideoProgress, 'courseId'>
  bookmarks: EntityTable<VideoBookmark, 'id'>
}

db.version(1).stores({
  importedCourses: 'id, name, importedAt, *tags',
  importedVideos: 'id, courseId, filename',
  importedPdfs: 'id, courseId, filename',
})

db.version(2)
  .stores({
    importedCourses: 'id, name, importedAt, status, *tags',
    importedVideos: 'id, courseId, filename',
    importedPdfs: 'id, courseId, filename',
  })
  .upgrade(tx => {
    return tx
      .table('importedCourses')
      .toCollection()
      .modify(course => {
        if (!course.status) {
          course.status = 'active'
        }
      })
  })

db.version(3).stores({
  importedCourses: 'id, name, importedAt, status, *tags',
  importedVideos: 'id, courseId, filename',
  importedPdfs: 'id, courseId, filename',
  progress: '[courseId+videoId], courseId, videoId',
  bookmarks: 'id, courseId, lessonId, createdAt',
})

export { db }
