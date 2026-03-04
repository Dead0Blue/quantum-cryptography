import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quantum Cryptography Platform',
  description: 'Educational Simulation Dashboard for QKD (BB84, E91)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="container animate-fade-in">
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              Quantum Key Distribution
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Interactive simulation platform for quantum cryptography protocols. 
              Explore secure communication using the fundamental laws of physics.
            </p>
          </header>
          {children}
        </main>
      </body>
    </html>
  )
}
