import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/app.css'
import { TooltipProvider } from '@radix-ui/react-tooltip'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Task Manager',
	description: 'A simple task management application'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<TooltipProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						{children}
					</ThemeProvider>
				</TooltipProvider>
			</body>
		</html>
	)
}
