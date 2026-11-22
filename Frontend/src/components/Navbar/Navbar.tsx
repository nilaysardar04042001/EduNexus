import { memo, useCallback, useEffect, useId, useRef } from 'react'
import type { MouseEvent } from 'react'
import { subscribeColorSchemeStorageSync, toggleColorScheme } from '../../utils/theme'
import { LoginIcon, MenuBarsIcon, MoonIcon, NavIcon, RegisterIcon, SunIcon } from './NavbarIcons'
import type { NavIconName } from './NavbarIcons'
import './Navbar.css'

export type NavSectionId = 'home' | 'courses' | 'practice' | 'projects' | 'about'
export type NavAuthAction = 'register' | 'login'

export interface NavbarProps {
  /** Currently active section/page identifier for aria-current="page" */
  activeSection?: NavSectionId
  /** Callback invoked when user selects a navigation link or Brand Home button */
  onNavigate?: (section: NavSectionId) => void
  /** Callback invoked when user clicks Registration or Login in the top-right bar */
  onAuthAction?: (action: NavAuthAction) => void
  /** Optional extra classes on the outer navbar wrapper */
  className?: string
}

interface NavSwitchItem {
  id: NavSectionId
  label: string
  href: string
  icon: NavIconName
}

const NAV_SWITCH_ITEMS: readonly NavSwitchItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: 'home' },
  { id: 'courses', label: 'Courses', href: '#courses', icon: 'courses' },
  { id: 'practice', label: 'Practice', href: '#practice', icon: 'practice' },
  { id: 'projects', label: 'Projects', href: '#projects', icon: 'projects' },
  { id: 'about', label: 'About', href: '#about', icon: 'about' },
] as const

function isPopoverOpen(el: HTMLElement): boolean {
  try {
    return el.matches(':popover-open')
  } catch {
    return el.classList.contains(':popover-open')
  }
}

function safeShowPopover(el: HTMLElement): void {
  if (typeof el.showPopover !== 'function') return
  try {
    el.showPopover()
  } catch {
    // Ignore if popover is already open or unsupported
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

  const barRef = useRef<HTMLDivElement | null>(null)
  const bottomInnerRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLUListElement | null>(null)

  const isWideRef = useRef<boolean>(false)
  const lastWidthRef = useRef<number>(0)

  // Keep <meta name="color-scheme"> synchronized across tabs via window storage events
  useEffect(() => subscribeColorSchemeStorageSync(), [])

  // Dynamically measure whether the full segmented switch row fits inside the bottom bar
  useEffect(() => {
    const bar = barRef.current
    const bottomInner = bottomInnerRef.current
    const menu = menuRef.current
    if (!bar || !bottomInner || !menu) return undefined

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

      const fitsInline = bottomInner.scrollWidth <= bottomInner.clientWidth

      if (fitsInline) {
        isWideRef.current = true
        bar.classList.add('is-wide')
        menu.removeAttribute('popover')
      } else {
        isWideRef.current = false
        bar.classList.remove('is-wide')
        menu.setAttribute('popover', 'auto')
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

  const closeNarrowMenu = useCallback(() => {
    const menu = menuRef.current
    if (menu && !isWideRef.current && isPopoverOpen(menu)) {
      safeHidePopover(menu)
    }
  }, [])

  const handleNavLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const section = event.currentTarget.dataset.section
      if (isNavSectionId(section)) {
        event.preventDefault()
        onNavigate?.(section)
        closeNarrowMenu()
        if (section === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    },
    [closeNarrowMenu, onNavigate],
  )

  const handleAuthLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const action = event.currentTarget.dataset.authAction
      if (isNavAuthAction(action)) {
        if (onAuthAction) {
          event.preventDefault()
          onAuthAction(action)
        }
        closeNarrowMenu()
      }
    },
    [closeNarrowMenu, onAuthAction],
  )

  const handleThemeToggleClick = useCallback(() => {
    toggleColorScheme()
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

      {/* Bottom Part: Paint-Mixing (Sky, Green, Yellow, Orange, Red) Bar with Sliding Segmented Switch */}
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

            <ul
              ref={menuRef}
              id={siteMenuId}
              className="edunexus-site-menu"
              data-active-section={activeSection}
              popover="auto"
            >
              {NAV_SWITCH_ITEMS.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <li key={item.id} className={isActive ? 'edunexus-switch-item is-active' : 'edunexus-switch-item'}>
                    <a
                      href={item.href}
                      data-section={item.id}
                      onClick={handleNavLinkClick}
                      aria-current={isActive ? 'page' : undefined}
                      className="edunexus-nav-link"
                    >
                      <NavIcon name={item.icon} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Subtle luminous 5-color gradient edge accent along the bottom of the Navbar */}
      <div className="edunexus-navbar-edge" aria-hidden="true">
        <span className="edunexus-navbar-edge-track" />
      </div>
    </div>
  )
})

export default Navbar
