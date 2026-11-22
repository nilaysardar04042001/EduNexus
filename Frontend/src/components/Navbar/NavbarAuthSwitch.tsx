import { memo } from 'react'
import type { MouseEvent } from 'react'
import { LoginIcon, RegisterIcon } from './NavbarIcons'
import type { NavAuthAction } from './types'

export interface NavbarAuthSwitchProps {
  activeAction: NavAuthAction
  onAuthClick: (event: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * Registration & Login control styled identically to the Segmented Switch button status bar:
 * recessed glass switch track, 5-color gradient rim, Font Awesome icons, and a sliding
 * CSS Anchor-Positioned spring-physics thumb between Register and Login.
 */
export const NavbarAuthSwitch = memo(function NavbarAuthSwitch({
  activeAction,
  onAuthClick,
}: NavbarAuthSwitchProps) {
  return (
    <div
      className="edunexus-auth-switch"
      data-nav-part="right-auth"
      data-active-auth={activeAction}
    >
      <a
        href="#register"
        data-auth-action="register"
        onClick={onAuthClick}
        className={
          activeAction === 'register'
            ? 'edunexus-auth-segment is-active'
            : 'edunexus-auth-segment'
        }
      >
        <RegisterIcon />
        <span>Register</span>
      </a>
      <a
        href="#login"
        data-auth-action="login"
        onClick={onAuthClick}
        className={
          activeAction === 'login' ? 'edunexus-auth-segment is-active' : 'edunexus-auth-segment'
        }
      >
        <LoginIcon />
        <span>Login</span>
      </a>
    </div>
  )
})
