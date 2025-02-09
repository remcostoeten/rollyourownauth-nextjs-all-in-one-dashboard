/**
 * A React component that applies animated text effects with configurable parameters
 * for text segmentation, animation presets, and timing controls.
 * @example see line 261
 */ 

'use client';

import { cn } from 'helpers';
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Transition,
  Variant,
  Variants,
} from 'motion/react';
import React from 'react';

/**
 * Animation preset types available for text effects
 * @typedef {'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'} PresetType
 */
export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';

/**
 * Text segmentation types for animation
 * @typedef {'word' | 'char' | 'line'} PerType
 */
export type PerType = 'word' | 'char' | 'line';

/**
 * Props for the TextEffect component
 * @typedef {Object} TextEffectProps
 */
export type TextEffectProps = {
  /** Text content to animate */
  children: React.ReactNode;
  /** How to split the text */
  per?: PerType;
  /** HTML element to render */
  as?: keyof React.JSX.IntrinsicElements;
  /** Custom animation variants */
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  /** CSS class for the container */
  className?: string;
  /** Animation preset */
  preset?: PresetType;
  /** Animation start delay in seconds */
  delay?: number;
  /** Speed multiplier for stagger timing */
  speedReveal?: number;
  /** Speed multiplier for segment animation */
  speedSegment?: number;
  /** Controls animation start */
  trigger?: boolean;
  /** Animation complete callback */
  onAnimationComplete?: () => void;
  /** Animation start callback */
  onAnimationStart?: () => void;
  /** CSS class for segment wrappers */
  segmentWrapperClassName?: string;
  /** Container animation transition */
  containerTransition?: Transition;
  /** Segment animation transition */
  segmentTransition?: Transition;
  /** Inline styles for container */
  style?: React.CSSProperties;
};

/** Default stagger timing for different segmentation types */
const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

/** Default container animation variants */
const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    },
  },
};

/** Default item animation variants */
const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Preset animation variants for different effects */
const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, y: 20, filter: 'blur(12px)' },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

/**
 * Memoized component for rendering animated text segments
 */
const AnimationComponent: React.FC<{
  segment: string;
  variants: Variants;
  per: 'line' | 'word' | 'char';
  segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  const content = per === 'line' ? (
    <motion.span variants={variants} className='block'>
      {segment}
    </motion.span>
  ) : per === 'word' ? (
    <motion.span
      aria-hidden='true'
      variants={variants}
      className='inline-block whitespace-pre'
    >
      {segment}
    </motion.span>
  ) : (
    <motion.span className='inline-block whitespace-pre'>
      {segment.split('').map((char, charIndex) => (
        <motion.span
          key={`char-${charIndex}`}
          aria-hidden='true'
          variants={variants}
          className='inline-block whitespace-pre'
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block';

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

AnimationComponent.displayName = 'AnimationComponent';

/**
 * Splits text into segments based on specified type
 */
const splitText = (text: string | undefined | null, per: 'line' | 'word' | 'char') => {
  if (!text) return [];
  if (per === 'line') return text.split('\n');
  return text.split(/(\s+)/);
};

/**
 * Type guard for variants with transitions
 */
const hasTransition = (
  variant: Variant
): variant is TargetAndTransition & { transition?: Transition } => {
  return (
    typeof variant === 'object' &&
    variant !== null &&
    'transition' in variant
  );
};

/**
 * Creates variants with merged transitions
 */
const createVariantsWithTransition = (
  baseVariants: Variants,
  transition?: Transition & { exit?: Transition }
): Variants => {
  if (!transition) return baseVariants;

  const { exit: _, ...mainTransition } = transition;

  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...(hasTransition(baseVariants.visible) ? baseVariants.visible.transition : {}),
        ...mainTransition,
      },
    },
    exit: {
      ...baseVariants.exit,
      transition: {
        ...(hasTransition(baseVariants.exit) ? baseVariants.exit.transition : {}),
        ...mainTransition,
        staggerDirection: -1,
      },
    },
  };
};

/**
 * TextEffect animates text with configurable segmentation and animation effects.
 * Supports word, character, and line-based animations with preset effects and
 * custom variants.
 * 
 * @example
 * // Basic usage with default fade animation
 * <TextEffect>Hello World</TextEffect>
 * 
 * @example
 * // Character-by-character animation with blur preset
 * <TextEffect
 *   per="char"
 *   preset="blur"
 *   delay={0.2}
 *   speedReveal={1.5}
 * >
 *   Animated Text
 * </TextEffect>
 * 
 * @example
 * // Custom animation variants with line segmentation
 * <TextEffect
 *   per="line"
 *   variants={{
 *     container: {
 *       hidden: { opacity: 0 },
 *       visible: {
 *         opacity: 1,
 *         transition: { staggerChildren: 0.1 }
 *       }
 *     },
 *     item: {
 *       hidden: { x: -20, opacity: 0 },
 *       visible: { x: 0, opacity: 1 }
 *     }
 *   }}
 * >
 *   First Line
 *   Second Line
 *   Third Line
 * </TextEffect>
 */
export const TextEffect = ({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextEffectProps) => {
  const text = children?.toString() || '';
  const segments = splitText(text, per);
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const baseVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const stagger = defaultStaggerTimes[per] / speedReveal;
  const baseDuration = 0.3 / speedSegment;

  const customStagger = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
      ?.staggerChildren
    : undefined;

  const customDelay = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
      ?.delayChildren
    : undefined;

  const computedVariants = {
    container: createVariantsWithTransition(
      variants?.container || baseVariants.container,
      {
        staggerChildren: customStagger ?? stagger,
        delayChildren: customDelay ?? delay,
        ...containerTransition,
        exit: {
          staggerChildren: customStagger ?? stagger,
          staggerDirection: -1,
        },
      }
    ),
    item: createVariantsWithTransition(
      variants?.item || baseVariants.item,
      {
        duration: baseDuration,
        ...segmentTransition,
      }
    ),
  };

  return (
    <AnimatePresence mode='popLayout'>
      {trigger && (
        <MotionTag
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={computedVariants.container}
          className={className}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
        >
          {per !== 'line' ? <span className='sr-only'>{children}</span> : null}
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              segment={segment}
              variants={computedVariants.item}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
};