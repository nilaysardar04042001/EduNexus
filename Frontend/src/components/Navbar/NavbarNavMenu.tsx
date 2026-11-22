import { memo } from 'react'
import type { MouseEvent, RefObject } from 'react'
import { NavbarAuthSwitch } from './NavbarAuthSwitch'
import { MenuBarsIcon, NavIcon } from './NavbarIcons'
import { NAV_SWITCH_ITEMS } from './types'
import type { NavAuthAction, NavSectionId } from './types'

export interface NavbarNavMenuProps {
  siteMenuId: string
  activeSection: NavSectionId
  activeAuthAction: NavAuthAction
  menuRef: RefObject<HTMLUListElement | null>
  onNavLinkClick: (event: MouseEvent<HTMLAnchorElement>) => void
  onAuthClick: (event: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Single semantic <nav> landmark:
 * - Wide layout: centered multi-position Segmented Switch with CSS Anchor sliding thumb.
 * - Mobile / narrow layout: Menu toggle button on the Right-Side Left Part opening a
 *   native popover="auto" menu containing the 5 nav links + Register/Login switch.
 */
export const NavbarNavMenu = memo(function NavbarNavMenu({
  siteMenuId,
  activeSection,
  activeAuthAction,
  menuRef,
  onNavLinkClick,
  onAuthClick,
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
        <span className="sr-only">Menu</span>
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

        {/* Mobile Menu Auth Switch: visible only inside the collapsed popover menu */}
        <li className="edunexus-menu-auth-item">
          <NavbarAuthSwitch activeAction={activeAuthAction} onAuthClick={onAuthClick} />
        </li>
      </ul>
    </nav>
  )
})
