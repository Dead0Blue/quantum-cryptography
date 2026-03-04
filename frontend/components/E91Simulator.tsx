'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Play, RefreshCw, XCircle } from 'lucide-react'

type E91Result = {
    num_pairs: number
    eve_present: boolean
    alice: { bases: string[], results: number[] }
    bob: { bases: string[], results: number[] }
    sifting: {
        sifted_key_alice: number[]
        sifted_key_bob: number[]
        error_rate: number
        is_secure: boolean
        errors_count: number
    }
}

export default function E91Simulator() {
    const [loading, setLoading] = useState(false)
    const [evePresent, setEvePresent] = useState(false)
    const [numPairs, setNumPairs] = useState(15)
    const [result, setResult] = useState<E91Result | null>(null)

    const runSimulation = async () => {
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:8000/api/e91/simulate?num_pairs=${numPairs}&eve_present=${evePresent}`)
            const data = await res.json()
            setResult(data)
        } catch (error) {
            console.error("Simulation failed", error)
        } finally {
            setLoading(false)
        }
    }

    // A1 (0), A2 (pi/4), A3 (pi/2)
    // B1 (pi/4), B2 (pi/2), B3 (3pi/4)
    const getBasisLabelStyle = (basis: string) => {
        if (basis === 'A2' || basis === 'B1') return { color: '#6366f1', label: 'π/4' } // Matcha
        if (basis === 'A3' || basis === 'B2') return { color: '#14b8a6', label: 'π/2' } // Match
        return { color: 'var(--text-muted)', label: basis.includes('A') ? '0' : '3π/4' } // Mismatch
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 className="heading-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>E91 Entanglement Protocol</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Utilizes quantum entanglement (<span style={{ fontFamily: 'var(--font-mono)' }}>|Φ⁺&gt;</span> Bell state) and tests CHSH inequality for security.</p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Entangled Pairs</span>
                        <input
                            type="range" min="5" max="30" value={numPairs}
                            onChange={(e) => setNumPairs(parseInt(e.target.value))}
                            style={{ accentColor: 'var(--accent-primary)' }}
                        />
                        <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>{numPairs} pairs</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={evePresent}
                            onChange={(e) => setEvePresent(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-secondary)' }}
                        />
                        <span style={{ color: evePresent ? 'var(--accent-secondary)' : 'inherit', fontWeight: evePresent ? 600 : 400 }}>
                            Eve Intercepts Entanglement
                        </span>
                    </label>

                    <button className="btn btn-primary" onClick={runSimulation} disabled={loading}>
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                        {loading ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </div>
            </div>

            {result && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: result.sifting.is_secure ? 'rgba(20, 184, 166, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                        border: `1px solid ${result.sifting.is_secure ? 'var(--accent-tertiary)' : 'var(--accent-secondary)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        {result.sifting.is_secure ? <CheckCircle2 color="var(--accent-tertiary)" size={28} /> : <AlertCircle color="var(--accent-secondary)" size={28} />}
                        <div>
                            <h3 style={{ color: result.sifting.is_secure ? 'var(--accent-tertiary)' : 'var(--accent-secondary)' }}>
                                {result.sifting.is_secure ? 'Entanglement Verified (Secure)' : 'Entanglement Destroyed! (Eavesdropper)'}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                CHSH correlation error rate: {(result.sifting.error_rate * 100).toFixed(1)}%
                                ({result.sifting.errors_count} errors in matched bases)
                            </p>
                        </div>
                    </div>

                    {/* Grid */}
                    <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                            <thead>
                                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Stage / Particle</th>
                                    {result.alice.bases.map((_, i) => <th key={i} style={{ padding: '12px 4px', fontWeight: 500 }}>{i + 1}</th>)}
                                </tr>
                            </thead>
                            <tbody style={{ fontFamily: 'var(--font-mono)' }}>

                                {/* Alice */}
                                <tr>
                                    <td style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Alice Base</td>
                                    {result.alice.bases.map((b, i) => {
                                        const style = getBasisLabelStyle(b)
                                        return <td key={i} style={{ color: style.color }}>{style.label}</td>
                                    })}
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left', padding: '12px 12px 24px', color: 'var(--text-main)' }}>Alice Result</td>
                                    {result.alice.results.map((r, i) => <td key={i}>{r}</td>)}
                                </tr>

                                {/* Bob */}
                                <tr>
                                    <td style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Bob Base</td>
                                    {result.bob.bases.map((b, i) => {
                                        const style = getBasisLabelStyle(b)
                                        return <td key={i} style={{ color: style.color }}>{style.label}</td>
                                    })}
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left', padding: '12px 12px 24px', color: 'var(--text-main)' }}>Bob Result</td>
                                    {result.bob.results.map((r, i) => {
                                        // Check if bases were compatible (A2=B1 or A3=B2)
                                        const aBasis = result.alice.bases[i]
                                        const bBasis = result.bob.bases[i]
                                        const match = (aBasis === 'A2' && bBasis === 'B1') || (aBasis === 'A3' && bBasis === 'B2')
                                        const isError = match && r !== result.alice.results[i]

                                        return (
                                            <td key={i} style={{ color: isError ? 'var(--accent-secondary)' : 'inherit', fontWeight: isError ? 'bold' : 'normal' }}>
                                                {r}
                                            </td>
                                        )
                                    })}
                                </tr>

                                {/* Sifting Result */}
                                <tr style={{ borderTop: '1px solid var(--glass-border)' }}>
                                    <td style={{ textAlign: 'left', padding: '24px 12px 12px', color: 'var(--text-main)', fontWeight: 600 }}>Sifted Key</td>
                                    {result.bob.results.map((r, i) => {
                                        const aBasis = result.alice.bases[i]
                                        const bBasis = result.bob.bases[i]
                                        const match = (aBasis === 'A2' && bBasis === 'B1') || (aBasis === 'A3' && bBasis === 'B2')

                                        return (
                                            <td key={i} style={{ paddingTop: '24px' }}>
                                                {match ? (
                                                    <div style={{
                                                        background: r === result.alice.results[i] ? 'rgba(20, 184, 166, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                                                        borderRadius: '4px',
                                                        padding: '2px',
                                                        color: r === result.alice.results[i] ? 'var(--accent-tertiary)' : 'var(--accent-secondary)'
                                                    }}>
                                                        {r}
                                                    </div>
                                                ) : <XCircle size={14} color="var(--glass-border)" style={{ margin: '0 auto' }} />}
                                            </td>
                                        )
                                    })}
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Final Shared Key: {result.sifting.sifted_key_bob.join('')} ({result.sifting.sifted_key_bob.length} bits)
                    </div>

                </div>
            )}
        </div>
    )
}
