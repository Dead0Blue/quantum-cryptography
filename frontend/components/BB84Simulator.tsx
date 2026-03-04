'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Play, RefreshCw, XCircle } from 'lucide-react'

type SimulationResult = {
    num_bits: number
    eve_present: boolean
    alice: { bits: number[], bases: string[] }
    bob: { bases: string[], results: number[] }
    eve: { bases: string[], results: number[] } | null
    sifting: {
        sifted_key_alice: number[]
        sifted_key_bob: number[]
        error_rate: number
        is_secure: boolean
        errors_count: number
    }
}

export default function BB84Simulator() {
    const [loading, setLoading] = useState(false)
    const [evePresent, setEvePresent] = useState(false)
    const [numBits, setNumBits] = useState(15)
    const [result, setResult] = useState<SimulationResult | null>(null)

    const runSimulation = async () => {
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:8000/api/bb84/simulate?num_bits=${numBits}&eve_present=${evePresent}`)
            const data = await res.json()
            setResult(data)
        } catch (error) {
            console.error("Simulation failed", error)
        } finally {
            setLoading(false)
        }
    }

    const getBasisIcon = (basis: string) => basis === 'X' ? '⨉' : '＋'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Control Panel */}
            <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 className="heading-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>BB84 Configuration</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Configure parameters for the quantum simulation</p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Number of Qubits</span>
                        <input
                            type="range" min="5" max="30" value={numBits}
                            onChange={(e) => setNumBits(parseInt(e.target.value))}
                            style={{ accentColor: 'var(--accent-primary)' }}
                        />
                        <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>{numBits} bits</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={evePresent}
                            onChange={(e) => setEvePresent(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-secondary)' }}
                        />
                        <span style={{ color: evePresent ? 'var(--accent-secondary)' : 'inherit', fontWeight: evePresent ? 600 : 400 }}>
                            Eavesdropper (Eve) Active
                        </span>
                    </label>

                    <button className="btn btn-primary" onClick={runSimulation} disabled={loading}>
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                        {loading ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </div>
            </div>

            {/* Results Visualization */}
            {result && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Security Status Banner */}
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
                                {result.sifting.is_secure ? 'Channel Secure' : 'Eavesdropping Detected!'}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Quantum Bit Error Rate (QBER): {(result.sifting.error_rate * 100).toFixed(1)}%
                                ({result.sifting.errors_count} errors. Threshold is ~11%)
                            </p>
                        </div>
                    </div>

                    {/* Qubit Stream Grid */}
                    <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                            <thead>
                                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Stage</th>
                                    {result.alice.bits.map((_, i) => <th key={i} style={{ padding: '12px 4px', fontWeight: 500 }}>Q{i + 1}</th>)}
                                </tr>
                            </thead>
                            <tbody style={{ fontFamily: 'var(--font-mono)' }}>

                                {/* Alice */}
                                <tr>
                                    <td style={{ textAlign: 'left', padding: '12px', color: 'var(--text-main)', fontWeight: 600 }}>Alice Bits</td>
                                    {result.alice.bits.map((b, i) => <td key={i}>{b}</td>)}
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left', padding: '12px 12px 24px', color: 'var(--text-muted)' }}>Alice Basis</td>
                                    {result.alice.bases.map((b, i) => <td key={i} style={{ color: 'var(--accent-primary)' }}>{getBasisIcon(b)}</td>)}
                                </tr>

                                {/* Eve (Optional) */}
                                {result.eve_present && result.eve && (
                                    <>
                                        <tr style={{ background: 'rgba(236, 72, 153, 0.05)' }}>
                                            <td style={{ textAlign: 'left', padding: '12px', color: 'var(--accent-secondary)', fontWeight: 600 }}>Eve Basis</td>
                                            {result.eve.bases.map((b, i) => <td key={i} style={{ color: 'var(--accent-secondary)' }}>{getBasisIcon(b)}</td>)}
                                        </tr>
                                        <tr style={{ background: 'rgba(236, 72, 153, 0.05)' }}>
                                            <td style={{ textAlign: 'left', padding: '12px 12px 24px', color: 'var(--accent-secondary)' }}>Eve Read</td>
                                            {result.eve.results.map((b, i) => <td key={i} style={{ color: 'var(--accent-secondary)' }}>{b}</td>)}
                                        </tr>
                                    </>
                                )}

                                {/* Bob */}
                                <tr>
                                    <td style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)' }}>Bob Basis</td>
                                    {result.bob.bases.map((b, i) => <td key={i} style={{ color: 'var(--accent-tertiary)' }}>{getBasisIcon(b)}</td>)}
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left', padding: '12px 12px 24px', color: 'var(--text-main)', fontWeight: 600 }}>Bob Results</td>
                                    {result.bob.results.map((b, i) => {
                                        const match = b === result.alice.bits[i]
                                        // Highlight if Bob's basis matched Alice's and the result was wrong (Eve's interference)
                                        const basisMatched = result.bob.bases[i] === result.alice.bases[i]
                                        const isError = basisMatched && !match

                                        return (
                                            <td key={i} style={{ color: isError ? 'var(--accent-secondary)' : 'inherit', fontWeight: isError ? 'bold' : 'normal' }}>
                                                {b}
                                            </td>
                                        )
                                    })}
                                </tr>

                                {/* Sifting Result */}
                                <tr style={{ borderTop: '1px solid var(--glass-border)' }}>
                                    <td style={{ textAlign: 'left', padding: '24px 12px 12px', color: 'var(--text-main)', fontWeight: 600 }}>Sifted Key</td>
                                    {result.bob.results.map((b, i) => {
                                        const basisMatched = result.bob.bases[i] === result.alice.bases[i]
                                        return (
                                            <td key={i} style={{ paddingTop: '24px' }}>
                                                {basisMatched ? (
                                                    <div style={{
                                                        background: b === result.alice.bits[i] ? 'rgba(20, 184, 166, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                                                        borderRadius: '4px',
                                                        padding: '2px',
                                                        color: b === result.alice.bits[i] ? 'var(--accent-tertiary)' : 'var(--accent-secondary)'
                                                    }}>
                                                        {b}
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
                        Final Key: {result.sifting.sifted_key_bob.join('')} ({result.sifting.sifted_key_bob.length} bits)
                    </div>

                </div>
            )}
        </div>
    )
}
