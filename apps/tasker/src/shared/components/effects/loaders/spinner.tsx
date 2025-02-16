import { LoaderCircleIcon, type LucideProps } from 'lucide-react'
import { cn } from 'helpers'
import IsFullScreen from './is-full-screen'
import { Center } from '../../common/center'

export type SpinnerProps = LucideProps & {
	center?: boolean
	isFullScreen?: boolean
	size?: number
	color?: string
}

export const Spinner = ({
	className,
	center = false,
	isFullScreen = false,
	size,
	color,
	...props
}: SpinnerProps) => {
	const spinnerContent = (
		<LoaderCircleIcon
			className={cn('animate-spin', className)}
			width={size}
			height={size}
			color={color}
			{...props}
		/>
	)

	const content = isFullScreen ? (
		<IsFullScreen>{spinnerContent}</IsFullScreen>
	) : (
		spinnerContent
	)

	return center ? <Center>{content}</Center> : content
}
