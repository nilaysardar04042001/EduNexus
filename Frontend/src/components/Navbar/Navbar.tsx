import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { subscribeColorSchemeStorageSync, toggleColorScheme } from '../../utils/theme'
import {
  ChevronDownIcon,
  LoginIcon,
  MenuBarsIcon,
  MoonIcon,
  NavIcon,
  RegisterIcon,
  SunIcon,
} from './NavbarIcons'
import type { NavIconName } from './NavbarIcons'
import './Navbar.css'

export type NavSectionId = 'home' | 'courses' | 'practice' | 'projects' | 'about'
export type NavAuthAction = 'register' | 'login'

export interface NavbarProps {
  /** Currently active section/page identifier for aria-current="page" */
  activeSection?: NavSectionId
  /** Callback invoked when user selects a navigation link or Brand Home button */
  onNavigate?: (section: NavSectionId, subItem?: string) => void
  /** Callback invoked when user clicks Registration or Login in the top-right bar */
  onAuthAction?: (action: NavAuthAction) => void
  /** Optional extra classes on the outer navbar wrapper */
  className?: string
}

interface CourseMenuItem {
  id: string
  label: string
  caption: string
  href: string
  icon: NavIconName
}

const COURSE_SUBMENU_ITEMS: readonly CourseMenuItem[] = [
  {
    id: 'fundamentals',
    label: 'Computer Fundamentals',
    caption: 'Hardware, OS & Digital Literacy',
    href: '#courses-fundamentals',
    icon: 'cpu',
  },
  {
    id: 'web-dev',
    label: 'Web Development',
    caption: 'HTML5, CSS3, React & TypeScript',
    href: '#courses-web',
    icon: 'code',
  },
  {
    id: 'python',
    label: 'Python & Logic',
    caption: 'Algorithms & Problem Solving',
    href: '#courses-python',
    icon: 'terminal',
  },
  {
    id: 'database',
    label: 'Database & SQL',
    caption: 'Relational Modeling & Queries',
    href: '#courses-sql',
    icon: 'database',
  },
] as const

function isPopoverOpen(el: HTMLElement): boolean {
  try {
    return el.matches(':popover-open')
  } catch {
    return el.classList.contains(':popover-open')
  }
}

function safeShowPopover(el: HTMLElement, source?: HTMLElement): void {
  if (typeof el.showPopover !== 'function') return
  try {
    const fn = el.showPopover as (options?: { source?: HTMLElement }) => void
    if (source) {
      fn.call(el, { source })
    } else {
      fn.call(el)
    }
  } catch {
    try {
      el.showPopover()
    } catch {
      // Ignore if popover is already open or unsupported
    }
  }
}

function safeHidePopover(el: HTMLElement): void {
  if (typeof el.hidePopover !== 'function') return
  try {
    el.hidePopover()
  } catch {
    // Ignore if popover is already closed
  }
}

function isNavSectionId(value: string | undefined): value is NavSectionId {
  return (
    value === 'home' ||
    value === 'courses' ||
    value === 'practice' ||
    value === 'projects' ||
    value === 'about'
  )
}

function isNavAuthAction(value: string | undefined): value is NavAuthAction {
  return value === 'register' || value === 'login'
}

export const Navbar = memo(function Navbar({
  activeSection = 'home',
  onNavigate,
  onAuthAction,
  className = '',
}: NavbarProps) {
  const uid = useId()
  const siteMenuId = `${uid}-site-menu`
  const coursesMenuId = `${uid}-courses-menu`

  const barRef = useRef<HTMLDivElement | null>(null)
  const bottomInnerRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLUListElement | null>(null)
  const submenuRef = useRef<HTMLUListElement | null>(null)
  const dropdownLiRef = useRef<HTMLLIElement | null>(null)
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null)

  const isWideRef = useRef<boolean>(false)
  const lastWidthRef = useRef<number>(0)
  const isHoverPreviewRef = useRef<boolean>(false)

  const [isCoursesOpen, setIsCoursesOpen] = useState<boolean>(false)

  // Keep <meta name="color-scheme"> synchronized across tabs via window storage events
  useEffect(() => subscribeColorSchemeStorageSync(), [])

  // Dynamically measure whether the full inline menu row fits inside the bottom bar
  useEffect(() => {
    const bar = barRef.current
    const bottomInner = bottomInnerRef.current
    const menu = menuRef.current
    const submenu = submenuRef.current
    const trigger = dropdownTriggerRef.current
    if (!bar || !bottomInner || !menu || !submenu || !trigger) return undefined

    let measureRafId: number | null = null

    const syncLayout = (forceMeasure = false) => {
      const currentWidth = bottomInner.clientWidth
      // While collapsed, only remeasure when the bar grows to prevent shrink thrashing
      if (!forceMeasure && !isWideRef.current && currentWidth <= lastWidthRef.current) {
        lastWidthRef.current = currentWidth
        return
      }
      lastWidthRef.current = currentWidth

      const wasMenuOpen = !isWideRef.current && isPopoverOpen(menu)

      bar.classList.add('is-measuring')
      bar.classList.add('is-wide')
      menu.removeAttribute('popover')

      // Keep submenu hidden during measurement so it cannot distort row width
      submenu.removeAttribute('popover')
      submenu.hidden = true

      const fitsInline = bottomInner.scrollWidth <= bottomInner.clientWidth

      if (fitsInline) {
        isWideRef.current = true
        bar.classList.add('is-wide')
        menu.removeAttribute('popover')
        submenu.setAttribute('popover', 'auto')
        submenu.hidden = false
        setIsCoursesOpen(false)
      } else {
        isWideRef.current = false
        bar.classList.remove('is-wide')
        menu.setAttribute('popover', 'auto')
        submenu.removeAttribute('popover')
        submenu.hidden = true
        setIsCoursesOpen(false)
        if (wasMenuOpen) {
          safeShowPopover(menu)
        }
      }

      if (measureRafId !== null) {
        cancelAnimationFrame(measureRafId)
      }
      measureRafId = requestAnimationFrame(() => {
        bar.classList.remove('is-measuring')
        measureRafId = null
      })
    }

    syncLayout(true)

    const observer = new ResizeObserver(() => {
      syncLayout(false)
    })
    observer.observe(bottomInner)
    observer.observe(menu)

    return () => {
      observer.disconnect()
      if (measureRafId !== null) {
        cancelAnimationFrame(measureRafId)
      }
    }
  }, [])

  // Sync submenu aria-expanded with native Popover toggle + JS fallback when Anchor Positioning is unsupported
  useEffect(() => {
    const submenu = submenuRef.current
    const trigger = dropdownTriggerRef.current
    if (!submenu || !trigger) return undefined

    const handleToggle = (event: Event) => {
      const toggleEvent = event as ToggleEvent
      const opened = toggleEvent.newState === 'open'
      setIsCoursesOpen(opened)

      if (!opened) {
        isHoverPreviewRef.current = false
        return
      }

      if (
        isWideRef.current &&
        (typeof CSS === 'undefined' || !CSS.supports('position-area', 'block-end'))
      ) {
        const triggerRect = trigger.getBoundingClientRect()
        const menuRect = submenu.getBoundingClientRect()
        let top = triggerRect.bottom + 8
        if (top + menuRect.height > window.innerHeight - 8) {
          top = Math.max(8, triggerRect.top - menuRect.height - 8)
        }
        const left = Math.max(8, Math.min(triggerRect.left, window.innerWidth - menuRect.width - 8))
        submenu.style.top = `${top}px`
        submenu.style.left = `${left}px`
      } else {
        submenu.style.top = ''
        submenu.style.left = ''
      }
    }

    submenu.addEventListener('toggle', handleToggle)
    return () => {
      submenu.removeEventListener('toggle', handleToggle)
    }
  }, [])

  // Wide-layout hover preview & keyboard focusout dismissal on the Courses dropdown item
  useEffect(() => {
    const li = dropdownLiRef.current
    const submenu = submenuRef.current
    const trigger = dropdownTriggerRef.current
    if (!li || !submenu || !trigger) return undefined

    const onPointerEnter = (event: globalThis.PointerEvent) => {
      if (!isWideRef.current) return
      if (event.pointerType === 'touch') return
      if (!window.matchMedia('(hover: hover)').matches) return
      if (isPopoverOpen(submenu)) return

      isHoverPreviewRef.current = true
      safeShowPopover(submenu, trigger)
    }

    const onPointerLeave = () => {
      if (!isWideRef.current || !isHoverPreviewRef.current) return
      isHoverPreviewRef.current = false
      if (isPopoverOpen(submenu)) {
        safeHidePopover(submenu)
      }
    }

    const onFocusOut = (event: globalThis.FocusEvent) => {
      if (!isWideRef.current) return
      const nextFocused = event.relatedTarget as Node | null
      if (nextFocused && !li.contains(nextFocused) && isPopoverOpen(submenu)) {
        isHoverPreviewRef.current = false
        safeHidePopover(submenu)
      }
    }

    li.addEventListener('pointerenter', onPointerEnter)
    li.addEventListener('pointerleave', onPointerLeave)
    li.addEventListener('focusout', onFocusOut)

    return () => {
      li.removeEventListener('pointerenter', onPointerEnter)
      li.removeEventListener('pointerleave', onPointerLeave)
      li.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  const closeOpenMenus = useCallback(() => {
    const submenu = submenuRef.current
    const menu = menuRef.current
    isHoverPreviewRef.current = false

    if (submenu) {
      if (isWideRef.current) {
        if (isPopoverOpen(submenu)) {
          safeHidePopover(submenu)
        }
      } else {
        submenu.hidden = true
      }
    }

    if (menu && !isWideRef.current && isPopoverOpen(menu)) {
      safeHidePopover(menu)
    }
    setIsCoursesOpen(false)
  }, [])

  const handleNavLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const section = event.currentTarget.dataset.section
      const subItem = event.currentTarget.dataset.subItem
      if (isNavSectionId(section)) {
        event.preventDefault()
        onNavigate?.(section, subItem)
        closeOpenMenus()
        if (section === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    },
    [closeOpenMenus, onNavigate],
  )

  const handleAuthLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const action = event.currentTarget.dataset.authAction
      if (isNavAuthAction(action)) {
        if (onAuthAction) {
          event.preventDefault()
          onAuthAction(action)
        }
        closeOpenMenus()
      }
    },
    [closeOpenMenus, onAuthAction],
  )

  const handleThemeToggleClick = useCallback(() => {
    toggleColorScheme()
  }, [])

  const handleDropdownTriggerClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const submenu = submenuRef.current
    if (!submenu) return

    if (isWideRef.current) {
      // If opened via hover preview, clicking pins it open instead of closing it
      if (isHoverPreviewRef.current) {
        isHoverPreviewRef.current = false
        event.preventDefault()
      }
      return
    }

    // Narrow layout: toggle inline disclosure list
    event.preventDefault()
    const nextOpen = Boolean(submenu.hidden)
    submenu.hidden = !nextOpen
    setIsCoursesOpen(nextOpen)
  }, [])

  return (
    <div ref={barRef} className={`edunexus-navbar ${className}`.trim()}>
      {/* Compositor-animated dual-theme 8-color ambient gradient mixing backdrop */}
      <div className="edunexus-navbar-ambient" aria-hidden="true">
        <span className="edunexus-ambient-wash" />
        <span className="edunexus-ambient-blob edunexus-ambient-blob-a" />
        <span className="edunexus-ambient-blob edunexus-ambient-blob-b" />
        <span className="edunexus-ambient-blob edunexus-ambient-blob-c" />
        <span className="edunexus-ambient-blob edunexus-ambient-blob-d" />
        <span className="edunexus-ambient-blob edunexus-ambient-blob-e" />
        <span className="edunexus-ambient-blob edunexus-ambient-blob-f" />
        <span className="edunexus-ambient-blob edunexus-ambient-blob-g" />
        <span className="edunexus-ambient-blob edunexus-ambient-blob-h" />
      </div>

      {/* Top Part: space-between Left (Glass Brand Home Button) and Right (Auth + Theme Toggle) */}
      <div className="edunexus-navbar-top" data-nav-part="top">
        <div className="edunexus-navbar-top-inner">
          {/* Top-Left Part: Brand Home Button with Glass Tint, Inner Shadow & Animated Tagline */}
          <div className="edunexus-top-left" data-nav-part="top-left">
            <a
              href="#home"
              data-section="home"
              onClick={handleNavLinkClick}
              aria-label="EduNexus — Go to Home page"
              className="edunexus-home-link"
            >
              <span className="edunexus-home-sheen" aria-hidden="true" />
              <span className="edunexus-home-logo-frame">
                <img
                  src="/EduNexus.png"
                  alt=""
                  width={38}
                  height={38}
                  decoding="async"
                  fetchPriority="high"
                  className="edunexus-home-logo-img"
                />
              </span>
              <span className="edunexus-brand-copy">
                <span className="edunexus-brand-title">
                  Edu<span className="edunexus-brand-accent">Nexus</span>
                </span>
                <span className="edunexus-home-tagline">Learn • Practice • Create • Excel</span>
              </span>
            </a>
          </div>

          {/* Top-Right Part: Divided into Right-Side Left (Register & Login) + Right-Side Right (Theme Toggle) */}
          <div className="edunexus-top-right" data-nav-part="top-right">
            <div className="edunexus-top-right-left" data-nav-part="top-right-left">
              <a
                href="#register"
                data-auth-action="register"
                onClick={handleAuthLinkClick}
                className="edunexus-auth-register"
              >
                <span className="edunexus-btn-sheen" aria-hidden="true" />
                <span className="edunexus-auth-icon-wrap" aria-hidden="true">
                  <RegisterIcon />
                </span>
                <span className="edunexus-auth-label">Register</span>
              </a>
              <a
                href="#login"
                data-auth-action="login"
                onClick={handleAuthLinkClick}
                className="edunexus-auth-login"
              >
                <span className="edunexus-auth-icon-wrap" aria-hidden="true">
                  <LoginIcon />
                </span>
                <span className="edunexus-auth-label">Login</span>
              </a>
            </div>

            <span className="edunexus-top-divider" aria-hidden="true" />

            <div className="edunexus-top-right-right" data-nav-part="top-right-right">
              <button
                type="button"
                className="edunexus-theme-toggle"
                onClick={handleThemeToggleClick}
              >
                <span className="edunexus-theme-glow" aria-hidden="true" />
                <span className="edunexus-theme-option edunexus-theme-to-dark">
                  <MoonIcon />
                  <span className="sr-only">Switch to dark theme</span>
                </span>
                <span className="edunexus-theme-option edunexus-theme-to-light">
                  <SunIcon />
                  <span className="sr-only">Switch to light theme</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Part: Enhanced Paint-Mixing (Sky, Green, Yellow, Orange, Red) Button Bar */}
      <div className="edunexus-navbar-bottom" data-nav-part="bottom">
        <div className="edunexus-bottom-paint" aria-hidden="true">
          <span className="edunexus-paint-base" />
          <span className="edunexus-paint-vortex" />
          <span className="edunexus-paint-swirl edunexus-paint-sky" />
          <span className="edunexus-paint-swirl edunexus-paint-green" />
          <span className="edunexus-paint-swirl edunexus-paint-yellow" />
          <span className="edunexus-paint-swirl edunexus-paint-orange" />
          <span className="edunexus-paint-swirl edunexus-paint-red" />
        </div>

        <div ref={bottomInnerRef} className="edunexus-navbar-bottom-inner">
          <nav className="edunexus-site-nav" aria-label="Primary navigation">
            <button
              type="button"
              className="edunexus-menu-button"
              popoverTarget={siteMenuId}
              popoverTargetAction="toggle"
              aria-controls={siteMenuId}
            >
              <MenuBarsIcon />
              <span>Menu</span>
            </button>

            <ul ref={menuRef} id={siteMenuId} className="edunexus-site-menu" popover="auto">
              <li>
                <a
                  href="#home"
                  data-section="home"
                  onClick={handleNavLinkClick}
                  aria-current={activeSection === 'home' ? 'page' : undefined}
                  className="edunexus-nav-link"
                >
                  <span className="edunexus-pill-icon-badge" aria-hidden="true">
                    <NavIcon name="home" />
                  </span>
                  <span>Home</span>
                </a>
              </li>

              <li ref={dropdownLiRef}>
                <button
                  ref={dropdownTriggerRef}
                  type="button"
                  data-section="courses"
                  className="edunexus-dropdown-trigger"
                  aria-expanded={isCoursesOpen}
                  aria-controls={coursesMenuId}
                  popoverTarget={coursesMenuId}
                  onClick={handleDropdownTriggerClick}
                >
                  <span className="edunexus-pill-icon-badge" aria-hidden="true">
                    <NavIcon name="courses" />
                  </span>
                  <span>Courses</span>
                  <ChevronDownIcon />
                </button>

                <ul ref={submenuRef} id={coursesMenuId} className="edunexus-dropdown-list">
                  {COURSE_SUBMENU_ITEMS.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        data-section="courses"
                        data-sub-item={item.id}
                        onClick={handleNavLinkClick}
                        className="edunexus-sub-link"
                      >
                        <span className="edunexus-sub-icon-badge">
                          <NavIcon name={item.icon} />
                        </span>
                        <span className="flex flex-col leading-tight">
                          <span className="text-xs font-bold">{item.label}</span>
                          <span className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {item.caption}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <a
                  href="#practice"
                  data-section="practice"
                  onClick={handleNavLinkClick}
                  aria-current={activeSection === 'practice' ? 'page' : undefined}
                  className="edunexus-nav-link"
                >
                  <span className="edunexus-pill-icon-badge" aria-hidden="true">
                    <NavIcon name="practice" />
                  </span>
                  <span>Practice</span>
                </a>
              </li>

              <li>
                <a
                  href="#projects"
                  data-section="projects"
                  onClick={handleNavLinkClick}
                  aria-current={activeSection === 'projects' ? 'page' : undefined}
                  className="edunexus-nav-link"
                >
                  <span className="edunexus-pill-icon-badge" aria-hidden="true">
                    <NavIcon name="projects" />
                  </span>
                  <span>Projects</span>
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  data-section="about"
                  onClick={handleNavLinkClick}
                  aria-current={activeSection === 'about' ? 'page' : undefined}
                  className="edunexus-nav-link"
                >
                  <span className="edunexus-pill-icon-badge" aria-hidden="true">
                    <NavIcon name="about" />
                  </span>
                  <span>About</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Subtle luminous gradient edge accent along the bottom of the Navbar */}
      <div className="edunexus-navbar-edge" aria-hidden="true">
        <span className="edunexus-navbar-edge-track" />
      </div>
    </div>
  )
})

export default Navbar
