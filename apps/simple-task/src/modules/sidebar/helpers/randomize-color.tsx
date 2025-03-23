// generate css utility function to randomize color

// have core funcntion and on that extend for palettes or other color schemes

import { useMemo } from 'react'

interface ColorConfig {
    opacity?: number // 0-100
    saturation?: number // 0-100
    lightness?: number // 0-100
    borderWidth?: 1 | 2 | 4 | 8
    glow?: boolean
    gradient?: boolean
}

const defaultConfig: ColorConfig = {
    opacity: 100,
    saturation: 70,
    lightness: 50,
    borderWidth: 4,
    glow: false,
    gradient: false
}

const rainbowColors = [
    { hue: 0, name: 'red' },    // red
    { hue: 30, name: 'orange' }, // orange
    { hue: 60, name: 'yellow' }, // yellow
    { hue: 120, name: 'green' }, // green
    { hue: 210, name: 'blue' },  // blue
    { hue: 240, name: 'indigo' }, // indigo
    { hue: 270, name: 'purple' }, // purple
    { hue: 330, name: 'pink' }   // pink
]

const monochromeColors = [
    { hue: 0, saturation: 0, lightness: 30 },
    { hue: 0, saturation: 0, lightness: 40 },
    { hue: 0, saturation: 0, lightness: 50 },
    { hue: 220, saturation: 10, lightness: 30 },
    { hue: 220, saturation: 10, lightness: 40 },
    { hue: 220, saturation: 10, lightness: 50 }
]

type ColorVariant = 'random' | 'rainbow' | 'monochrome'

function generateColorClass(hue: number, config: ColorConfig = defaultConfig) {
    const {
        opacity = 100,
        saturation = 70,
        lightness = 50,
        borderWidth = 4,
        glow = false,
        gradient = false
    } = config

    const baseColor = `hsl(${hue},${saturation}%,${lightness}%)`
    const opacityValue = opacity / 100

    let className = `border-l-${borderWidth} `

    if (gradient) {
        const nextHue = (hue + 30) % 360
        className += `border-l-[linear-gradient(to_right,${baseColor},hsl(${nextHue},${saturation}%,${lightness}%))] `
    } else {
        className += `border-l-[${baseColor}] `
    }

    if (glow) {
        className += `shadow-[0_0_10px_${baseColor}] `
    }

    if (opacity !== 100) {
        className += `opacity-[${opacityValue}] `
    }

    return className.trim()
}

/**
 * A hook that generates dynamic color classes for active items in the sidebar
 * 
 * @param id - The unique identifier of the item
 * @param variant - The color variant to use ('random', 'rainbow', or 'monochrome')
 * @param config - Configuration options for color generation
 * 
 * @example
 * // Basic usage with rainbow colors
 * const color = useActiveItemColor('item-1', 'rainbow')
 * 
 * @example
 * // Random color with glow effect
 * const color = useActiveItemColor('item-2', 'random', { glow: true })
 * 
 * @example
 * // Monochrome with custom opacity
 * const color = useActiveItemColor('item-3', 'monochrome', { opacity: 75 })
 * 
 * @example
 * // Rainbow with gradient and thick border
 * const color = useActiveItemColor('item-4', 'rainbow', { 
 *   gradient: true,
 *   borderWidth: 8,
 *   saturation: 80,
 *   lightness: 60
 * })
 * 
 * @example
 * // Custom configuration for special effects
 * const color = useActiveItemColor('item-5', 'random', {
 *   opacity: 90,
 *   saturation: 100,
 *   lightness: 50,
 *   borderWidth: 4,
 *   glow: true,
 *   gradient: true
 * })
 */
export function useActiveItemColor(
    id: string,
    variant: ColorVariant = 'rainbow',
    config: ColorConfig = defaultConfig
) {
    return useMemo(() => {
        switch (variant) {
            case 'random': {
                const hue = Math.floor(Math.random() * 360)
                return generateColorClass(hue, config)
            }
            
            case 'rainbow': {
                const rainbowIndex = Math.abs(
                    id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                ) % rainbowColors.length
                return generateColorClass(rainbowColors[rainbowIndex].hue, config)
            }
            
            case 'monochrome': {
                const monoIndex = Math.abs(
                    id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                ) % monochromeColors.length
                const { hue, saturation, lightness } = monochromeColors[monoIndex]
                return generateColorClass(hue, {
                    ...config,
                    saturation,
                    lightness
                })
            }
            
            default:
                return generateColorClass(210, config) // Default blue-ish color
        }
    }, [id, variant, config])
}

// Example usage in comments:
/*
// Basic usage
const basicColor = useActiveItemColor('item-1', 'rainbow')

// With glow effect
const glowColor = useActiveItemColor('item-2', 'random', { glow: true })

// Semi-transparent gradient
const gradientColor = useActiveItemColor('item-3', 'rainbow', {
    opacity: 75,
    gradient: true,
    borderWidth: 8
})

// Custom monochrome
const customMono = useActiveItemColor('item-4', 'monochrome', {
    saturation: 10,
    lightness: 30,
    borderWidth: 2
})

// Full custom configuration
const customColor = useActiveItemColor('item-5', 'random', {
    opacity: 90,
    saturation: 100,
    lightness: 50,
    borderWidth: 4,
    glow: true,
    gradient: true
})
*/

function BaseRandomizeFnc() {
    return {
        randomizeColor: () => {
            return `#${Math.floor(Math.random()*16777215).toString(16)}`;
        }
    }
}

export { BaseRandomizeFnc };