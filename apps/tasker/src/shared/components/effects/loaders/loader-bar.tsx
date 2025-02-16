import type { LucideProps } from 'lucide-react'
import IsFullScreen from './is-full-screen'
import { Center } from '../../common/center'

export type BarsProps = LucideProps & {
	size?: number
	center?: boolean
	isFullScreen?: boolean
	color?: string
}

export const LoaderBar = ({
	size = 24,
	center = false,
	isFullScreen = false,
	color,
	...props
}: BarsProps) => {
	const barsContent = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			{...props}
			fill={color || 'currentColor'} // Use color prop or default to currentColor
		>
			<title>Loading...</title>
			<style>{`
        .spinner-bar {
          animation: spinner-bars-animation .8s linear infinite;
          animation-delay: -.8s;
        }
        .spinner-bars-2 {
          animation-delay: -.65s;
        }
        .spinner-bars-3 {
          animation-delay: -0.5s;
        }
        @keyframes spinner-bars-animation {
          0% {
            y: 1px;
            height: 22px;
          }
          93.75% {
            y: 5px;
            height: 14px;
            opacity: 0.2;
          }
        }
      `}</style>
			<rect
				className="spinner-bar"
				x="1"
				y="1"
				width="6"
				height="22"
				fill="inherit" // Inherit the color from the parent svg
			/>
			<rect
				className="spinner-bar spinner-bars-2"
				x="9"
				y="1"
				width="6"
				height="22"
				fill="inherit" // Inherit the color from the parent svg
			/>
			<rect
				className="spinner-bar spinner-bars-3"
				x="17"
				y="1"
				width="6"
				height="22"
				fill="inherit" // Inherit the color from the parent svg
			/>
		</svg>
	)

	const content = isFullScreen ? (
		<IsFullScreen>{barsContent}</IsFullScreen>
	) : (
		barsContent
	)

	return center ? <Center>{content}</Center> : content
}
