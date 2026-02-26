import { Link, useLocation } from 'react-router'

interface Variant {
  label: string
  path: string
}

const overviewVariants: Variant[] = [
  { label: 'Original', path: '/' },
  { label: 'Swiss', path: '/prototypes/swiss-overview' },
  { label: 'Hybrid', path: '/prototypes/hybrid-overview' },
]

const coursesVariants: Variant[] = [
  { label: 'Original', path: '/courses' },
  { label: 'Swiss', path: '/prototypes/swiss-courses' },
  { label: 'Hybrid', path: '/prototypes/hybrid-courses' },
]

export function ComparisonToggle() {
  const { pathname } = useLocation()

  const isCoursesPage = pathname.includes('courses')
  const variants = isCoursesPage ? coursesVariants : overviewVariants
  const pageLabel = isCoursesPage ? 'Courses' : 'Overview'

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-black/90 text-white rounded-full px-2 py-1.5 shadow-2xl backdrop-blur-sm">
      <span className="text-xs font-medium text-white/60 px-3">{pageLabel}:</span>
      {variants.map(v => {
        const isActive = v.path === pathname
        return (
          <Link
            key={v.path}
            to={v.path}
            className={`
              text-xs font-medium px-4 py-1.5 rounded-full transition-colors
              ${isActive ? 'bg-white text-black' : 'text-white/80 hover:text-white hover:bg-white/10'}
            `}
          >
            {v.label}
          </Link>
        )
      })}
      <span className="w-px h-4 bg-white/20 mx-1" />
      <Link
        to="/prototypes"
        className="text-xs font-medium text-white/60 hover:text-white px-3 py-1.5 transition-colors"
      >
        All Prototypes
      </Link>
    </div>
  )
}
