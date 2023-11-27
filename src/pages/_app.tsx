import '@/styles/globals.css'
import Navbar from '@/components/navbar'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ThemeProvider attribute='class' >
      <SessionProvider session={session}>
        <div className='h-screen flex flex-col' >
          <Navbar />
          <Component {...pageProps} />
          <ToastContainer
            autoClose={3000}
            position="bottom-right"
          />
        </div>
      </SessionProvider>
    </ThemeProvider>
  )
}
