import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons/faBookOpen'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faCompass } from '@fortawesome/free-solid-svg-icons/faCompass'
import { faRocket } from '@fortawesome/free-solid-svg-icons/faRocket'
import { faTrophy } from '@fortawesome/free-solid-svg-icons/faTrophy'
import { memo } from 'react'
import type { MouseEventHandler } from 'react'
import {
  EDUNEXUS_SLIDE1_IMAGE_DEFAULT_URL,
  EDUNEXUS_SLIDE1_IMAGE_SIZE,
  EDUNEXUS_SLIDE1_IMAGE_SIZES,
  EDUNEXUS_SLIDE1_IMAGE_SRCSET,
} from '../../../utils/cloudinary'
import { HeaderSlideFrame } from './HeaderSlideFrame'
import type { HeaderSlideProps } from './types'
import './HeaderSlide1.css'

type FaIconDef = typeof faBookOpen

interface SlideHighlight {
  readonly id: 'learn' | 'practice' | 'create' | 'excel'
  readonly title: string
  readonly description: string
  readonly icon: FaIconDef
}

const SLIDE1_HIGHLIGHTS: readonly SlideHighlight[] = [
  {
    id: 'learn',
    title: 'Learn',
    description: 'Explore structured courses and tutorials.',
    icon: faBookOpen,
  },
  {
    id: 'practice',
    title: 'Practice',
    description: 'Improve your coding and problem-solving skills.',
    icon: faCode,
  },
  {
    id: 'create',
    title: 'Create',
    description: 'Build projects and experiment with code.',
    icon: faRocket,
  },
  {
    id: 'excel',
    title: 'Excel',
    description: 'Track your growth and achieve your goals.',
    icon: faTrophy,
  },
] as const

function SlideIcon({ icon }: { icon: FaIconDef }) {
  const [width, height, , , svgPathData] = icon.icon
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
      className="edunexus-slide1-svg"
    >
      {Array.isArray(svgPathData) ? (
        svgPathData.map((d) => <path key={d} fill="currentColor" d={d} />)
      ) : (
        <path fill="currentColor" d={svgPathData} />
      )}
    </svg>
  )
}

export interface HeaderSlide1Props extends HeaderSlideProps {
  /** Optional custom right-side square image URL */
  imageSrc?: string
  /** Optional custom responsive srcset for the square image */
  imageSrcSet?: string
  /** Optional custom sizes attribute for the square image */
  imageSizes?: string
  /** Optional accessible alt text for the square image */
  imageAlt?: string
  /** Optional href for the "Start Learning" primary CTA */
  startLearningHref?: string
  /** Optional href for the "Explore Courses" secondary CTA */
  exploreCoursesHref?: string
  /** Optional click handler for the "Start Learning" CTA */
  onStartLearning?: MouseEventHandler<HTMLAnchorElement>
  /** Optional click handler for the "Explore Courses" CTA */
  onExploreCourses?: MouseEventHandler<HTMLAnchorElement>
}

/**
 * Slide 1 of the EduNexus header banner slider.
 * Features the EduNexus welcome heading, subheading, description, 4 learning pillars,
 * primary/secondary CTAs, and the Cloudinary square emblem anchored on the right side.
 */
export const HeaderSlide1 = memo(function HeaderSlide1({
  index,
  total,
  isActive,
  ariaLabel,
  className,
  children,
  imageSrc = EDUNEXUS_SLIDE1_IMAGE_DEFAULT_URL,
  imageSrcSet = EDUNEXUS_SLIDE1_IMAGE_SRCSET,
  imageSizes = EDUNEXUS_SLIDE1_IMAGE_SIZES,
  imageAlt = 'EduNexus — Learn, Practice, Create, Excel emblem',
  startLearningHref = '#learn',
  exploreCoursesHref = '#courses',
  onStartLearning,
  onExploreCourses,
}: HeaderSlide1Props) {
  return (
    <HeaderSlideFrame
      slideId="slide-1"
      index={index}
      total={total}
      isActive={isActive}
      variant={0}
      ariaLabel={ariaLabel}
      className={className}
    >
      <div className="edunexus-slide1-surface">
        <div className="edunexus-slide1-grid">
          <div className="edunexus-slide1-header">
            <h1 className="edunexus-slide1-heading">
              Welcome to <span className="edunexus-slide1-brand">EduNexus</span>
            </h1>
            <p className="edunexus-slide1-subheading">Your Learning &amp; Practice Platform</p>
          </div>

          <p className="edunexus-slide1-desc">
            Explore technology, develop programming skills, practice your knowledge, and build
            real-world projects — all in one place.
          </p>

          <ul className="edunexus-slide1-features" aria-label="EduNexus feature highlights">
            {SLIDE1_HIGHLIGHTS.map((item) => (
              <li key={item.id} className="edunexus-slide1-feature" data-highlight={item.id}>
                <span className="edunexus-slide1-feature-icon" aria-hidden="true">
                  <SlideIcon icon={item.icon} />
                </span>
                <p className="edunexus-slide1-feature-text">
                  <strong className="edunexus-slide1-feature-title">{item.title}</strong> —{' '}
                  {item.description}
                </p>
              </li>
            ))}
          </ul>

          <div className="edunexus-slide1-actions">
            <a
              href={startLearningHref}
              onClick={onStartLearning}
              className="edunexus-slide1-cta edunexus-slide1-cta-primary"
            >
              <span>Start Learning</span>
              <SlideIcon icon={faArrowRight} />
            </a>
            <a
              href={exploreCoursesHref}
              onClick={onExploreCourses}
              className="edunexus-slide1-cta edunexus-slide1-cta-secondary"
            >
              <SlideIcon icon={faCompass} />
              <span>Explore Courses</span>
            </a>
          </div>

          <div className="edunexus-slide1-media">
            <img
              src={imageSrc}
              srcSet={imageSrcSet}
              sizes={imageSizes}
              alt={imageAlt}
              width={EDUNEXUS_SLIDE1_IMAGE_SIZE}
              height={EDUNEXUS_SLIDE1_IMAGE_SIZE}
              loading="eager"
              decoding="async"
              crossOrigin="anonymous"
              className="edunexus-slide1-img"
            />
          </div>

          {children ? <div className="edunexus-slide1-extra">{children}</div> : null}
        </div>
      </div>
    </HeaderSlideFrame>
  )
})

export default HeaderSlide1
