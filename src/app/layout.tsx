import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import React from 'react'
import { Toaster } from '@components/ui/toaster'
import { Provider } from '@components/providers/Provider'

export const metadata: Metadata = {
  title: 'Tests del permiso de armas',
  description: 'Generated by create next app'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen">
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </Provider>
      </body>
    </html>
  )
}
