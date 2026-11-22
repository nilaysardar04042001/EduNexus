import { memo } from 'react'
import type { MouseEvent, RefObject } from 'react'
import { MenuBarsIcon, NavIcon } from './NavbarIcons'
import { NAV_SWITCH_ITEMS } from './types'
import type { NavSectionId } from './types'

export interface NavbarNavMenuProps {
  siteMenuId: string
  activeSection: NavSectionId
  menuRef: RefObject<HTMLUListElement | null>
  onNavLinkClick: (event: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Single semantic <nav> landmark:
 * - Wide layout: centered multi-position Segmented Switch with CSS Anchor sliding thumb.
 * - Mobile / narrow layout: left-most control on the right side (Right-Side Left Part)
 *   opening a native popover="auto" navigation menu.
 */
export const NavbarNavMenu = memo(function NavbarNavMenu({
  siteMenuId,
  activeSection,
  menuRef,
  onNavLinkClick,
}: NavbarNavMenuProps) {
  return (
    <nav className="edunexus-site-nav" data-nav-part="middle" aria-label="Primary navigation">
      <button
        type="button"
        className="edunexus-menu-button"
        popoverTarget={siteMenuId}
        popoverTargetAction="toggle"
        aria-controls={siteMenuId}
      >
        <MenuBarsIcon />
        <span className="edunexus-menu-label">Menu</span>
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
            <li
              key={item.id}
              className={isActive ? 'edunexus-switch-item is-active' : 'edunexus-switch-item'}
            >
              <a
                href={item.href}
                data-section={item.id}
                onClick={onNavLinkClick}
                aria-current={isActive ? 'page' : undefined}
                className="edunexus-nav-link"
              >
                <NavIcon name={item.id} />
                <span>{item.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
})
