import type { Metadata } from 'next'
import '@/styles/app.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Rollyourownauth',
	description: 'Roll your own auth + all-in-one comprehensive, for me-dashboard',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	)
}
