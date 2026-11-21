import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { ArrowRightIcon, ChevronDownIcon, MenuBarsIcon, NavIcon } from './NavbarIcons'
import type { NavIconName } from './NavbarIcons'
import './Navbar.css'

export type NavSectionId = 'home' | 'courses' | 'practice' | 'projects' | 'about'

export interface NavbarProps {
  /** Currently active section/page identifier for aria-current="page" */
  activeSection?: NavSectionId
  /** Callback invoked when user selects a navigation link or Home button */
  onNavigate?: (section: NavSectionId, subItem?: string) => void
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

export const Navbar = memo(function Navbar({
  activeSection = 'home',
  onNavigate,
  className = '',
}: NavbarProps) {
  const uid = useId()
  const siteMenuId = `${uid}-site-menu`
  const coursesMenuId = `${uid}-courses-menu`

  const barRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLUListElement | null>(null)
  const submenuRef = useRef<HTMLUListElement | null>(null)
  const dropdownLiRef = useRef<HTMLLIElement | null>(null)
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null)

  const isWideRef = useRef<boolean>(false)
  const lastWidthRef = useRef<number>(0)
  const isHoverPreviewRef = useRef<boolean>(false)

  const [isCoursesOpen, setIsCoursesOpen] = useState<boolean>(false)

  // Dynamically measure whether the full inline row fits (no hardcoded breakpoint)
  useEffect(() => {
    const bar = barRef.current
    const inner = innerRef.current
    const menu = menuRef.current
    const submenu = submenuRef.current
    const trigger = dropdownTriggerRef.current
    if (!bar || !inner || !menu || !submenu || !trigger) return undefined

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

      // Ensure submenu is hidden during measurement so it cannot distort row width
      submenu.removeAttribute('popover')
      submenu.hidden = true

      const fitsInline = inner.scrollWidth <= inner.clientWidth

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
    observer.observe(bar)
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
      <div ref={innerRef} className="edunexus-navbar-inner">
        {/* Home Page Button powered by Frontend/public/EduNexus.png */}
        <a
          href="#home"
          data-section="home"
          onClick={handleNavLinkClick}
          aria-label="EduNexus — Go to Home page"
          className="edunexus-home-link"
        >
          <span className="edunexus-home-logo-frame">
            <img
              src="/EduNexus.png"
              alt=""
              width={40}
              height={40}
              decoding="async"
              fetchPriority="high"
              className="edunexus-home-logo-img"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              Edu
              <span className="bg-linear-to-r from-cyan-500 via-sky-500 to-violet-500 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-300 dark:to-fuchsia-400">
                Nexus
              </span>
            </span>
            <span className="mt-1 text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
              Learn • Practice • Create • Excel
            </span>
          </span>
        </a>

        {/* Single Semantic Navigation Tree (Popover when narrow, Inline when wide) */}
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
                <NavIcon name="home" />
                <span>Home</span>
              </a>
            </li>

            <li ref={dropdownLiRef}>
              <button
                ref={dropdownTriggerRef}
                type="button"
                className="edunexus-dropdown-trigger"
                aria-expanded={isCoursesOpen}
                aria-controls={coursesMenuId}
                popoverTarget={coursesMenuId}
                onClick={handleDropdownTriggerClick}
              >
                <NavIcon name="courses" />
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
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/12 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300">
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
                <NavIcon name="practice" />
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
                <NavIcon name="projects" />
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
                <NavIcon name="about" />
                <span>About</span>
              </a>
            </li>
          </ul>

          <a
            href="#courses"
            data-section="courses"
            onClick={handleNavLinkClick}
            className="edunexus-nav-cta"
          >
            <span>Get Started</span>
            <ArrowRightIcon />
          </a>
        </nav>
      </div>
    </div>
  )
})

export default Navbar
