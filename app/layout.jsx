import './globals.css'
import { Inter } from 'next/font/google'

import Provider from './Provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Meme Generator',
  description: 'created by medetcan diler',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100 py-20`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
