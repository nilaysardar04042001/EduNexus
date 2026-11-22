export type NavIconName =
  | 'home'
  | 'courses'
  | 'practice'
  | 'projects'
  | 'about'
  | 'cpu'
  | 'code'
  | 'terminal'
  | 'database'

export function NavIcon({ name, className = 'edunexus-nav-icon' }: { name: NavIconName; className?: string }) {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <path
            d="M3 10.5L12 3.5L21 10.5V19.5A1.5 1.5 0 0 1 19.5 21H14.5V14.5H9.5V21H4.5A1.5 1.5 0 0 1 3 19.5V10.5Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'courses':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <path
            d="M4 6.5C7.2 6.5 10.2 7.6 12 9.4C13.8 7.6 16.8 6.5 20 6.5V18.5C16.8 18.5 13.8 19.4 12 21C10.2 19.4 7.2 18.5 4 18.5V6.5Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <path d="M12 9.4V21" stroke="currentColor" strokeWidth="1.9" />
        </svg>
      )
    case 'practice':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <path
            d="M8.5 8L4.5 12L8.5 16M15.5 8L19.5 12L15.5 16M13.5 6L10.5 18"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'projects':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <path d="M12 12L20 7.5M12 12V21M12 12L4 7.5" stroke="currentColor" strokeWidth="1.9" />
        </svg>
      )
    case 'about':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
          <path d="M12 16V11.5M12 8.2H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'cpu':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M9 3V7M15 3V7M9 17V21M15 17V21M3 9H7M3 15H7M17 9H21M17 15H21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'code':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="4.5" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M3 9H21M9 13L7 15L9 17M15 13L17 15L15 17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'terminal':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="4.5" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M7.5 10L10.5 12.5L7.5 15M12.5 15H16.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'database':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
          <ellipse cx="12" cy="6.5" rx="7" ry="3" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M5 6.5V17.5C5 19.16 8.13 20.5 12 20.5C15.87 20.5 19 19.16 19 17.5V6.5M5 12C5 13.66 8.13 15 12 15C15.87 15 19 13.66 19 12"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      )
  }
}

export function ChevronDownIcon({ className = 'edunexus-chevron' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" className={className} aria-hidden="true">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MenuBarsIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className={className} aria-hidden="true">
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function RegisterIcon({ className = 'edunexus-auth-icon' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" className={className} aria-hidden="true">
      <circle cx="9.5" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M3.5 19.5C3.5 16.46 6.19 14 9.5 14C12.81 14 15.5 16.46 15.5 19.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M18.5 8V14M15.5 11H21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function LoginIcon({ className = 'edunexus-auth-icon' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 4.5H18.5A1.5 1.5 0 0 1 20 6V18A1.5 1.5 0 0 1 18.5 19.5H14"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12H14.5M10.5 8L14.5 12L10.5 16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SunIcon({ className = 'edunexus-theme-icon' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M12 2.75V5M12 19V21.25M4.75 12H2.5M21.5 12H19.25M6.34 6.34L4.75 4.75M19.25 19.25L17.66 17.66M17.66 6.34L19.25 4.75M4.75 19.25L6.34 17.66"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MoonIcon({ className = 'edunexus-theme-icon' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.2 14.3A8.2 8.2 0 0 1 9.7 3.8A8.5 8.5 0 1 0 20.2 14.3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
