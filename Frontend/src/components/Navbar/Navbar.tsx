import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { subscribeColorSchemeStorageSync, toggleColorScheme } from '../../utils/theme'
import { NavbarAmbient, NavbarEdgeAccent } from './NavbarAmbient'
import { NavbarAuthSwitch } from './NavbarAuthSwitch'
import { NavbarBrand } from './NavbarBrand'
import { NavbarNavMenu } from './NavbarNavMenu'
import { NavbarThemeToggle } from './NavbarThemeToggle'
import { isNavAuthAction, isNavSectionId } from './types'
import type { NavAuthAction, NavbarProps } from './types'
import './Navbar.css'

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

export const Navbar = memo(function Navbar({
  activeSection = 'home',
  activeAuthAction,
  onNavigate,
  onAuthAction,
  className = '',
}: NavbarProps) {
  const uid = useId()
  const siteMenuId = `${uid}-site-menu`

  const barRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLUListElement | null>(null)

  const isWideRef = useRef<boolean>(false)
  const lastWidthRef = useRef<number>(0)

  const [internalAuthAction, setInternalAuthAction] = useState<NavAuthAction>('register')
  const currentAuthAction = activeAuthAction ?? internalAuthAction

  // Keep <meta name="color-scheme"> synchronized across tabs via window storage events
  useEffect(() => subscribeColorSchemeStorageSync(), [])

  // Dynamically measure whether Brand + Middle Switch + Right Controls fit inline in one bar
  useEffect(() => {
    const bar = barRef.current
    const inner = innerRef.current
    const menu = menuRef.current
    if (!bar || !inner || !menu) return undefined

    let measureRafId: number | null = null

    const syncLayout = (forceMeasure = false) => {
      const currentWidth = bar.clientWidth
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

      const fitsInline = inner.scrollWidth <= inner.clientWidth

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
    observer.observe(bar)
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
        setInternalAuthAction(action)
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
      <NavbarAmbient />

      <div className="edunexus-navbar-surface">
        <div ref={innerRef} className="edunexus-navbar-inner">
          {/* Left Part: Brand Home Button */}
          <NavbarBrand onHomeClick={handleNavLinkClick} />

          {/* Middle Part (Desktop) / Right-Side Left Part (Mobile Menu Button) */}
          <NavbarNavMenu
            siteMenuId={siteMenuId}
            activeSection={activeSection}
            menuRef={menuRef}
            onNavLinkClick={handleNavLinkClick}
          />

          {/* Right Part: Registration & Login Switch + Theme Toggle */}
          <div className="edunexus-nav-right" data-nav-part="right">
            <NavbarAuthSwitch
              activeAction={currentAuthAction}
              onAuthClick={handleAuthLinkClick}
            />
            <span className="edunexus-top-divider" aria-hidden="true" />
            <NavbarThemeToggle onToggle={handleThemeToggleClick} />
          </div>
        </div>
      </div>

      <NavbarEdgeAccent />
    </div>
  )
})

export default Navbar
