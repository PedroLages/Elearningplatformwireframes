export function LevelUpLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        aria-hidden="true"
      >
        {/* Bottom step */}
        <rect x="0" y="40" width="60" height="20" fill="currentColor" />
        {/* Middle step */}
        <rect x="24" y="22" width="36" height="18" fill="currentColor" />
        {/* Arrow shaft */}
        <rect x="34" y="6" width="12" height="16" fill="currentColor" />
        {/* Arrow head */}
        <polygon points="40,0 22,6 58,6" fill="currentColor" />
      </svg>
      <span className="font-bold text-xl">LevelUp</span>
    </div>
  )
}
