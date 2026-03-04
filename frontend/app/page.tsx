'use client'

import { useState } from 'react'
import BB84Simulator from '@/components/BB84Simulator'
import E91Simulator from '@/components/E91Simulator'
import { Shield, RadioTower } from 'lucide-react'

export default function Home() {
    const [activeTab, setActiveTab] = useState<'bb84' | 'e91'>('bb84')

    return (
        <div className="flex-center" style={{ flexDirection: 'column', gap: '2rem' }}>

            {/* Protocol Selector Tabs */}
            <div
                className="glass-panel"
                style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '10px',
                    borderRadius: 'var(--radius-full)'
                }}
            >
                <button
                    className={activeTab === 'bb84' ? 'btn btn-primary' : 'btn btn-secondary'}
                    onClick={() => setActiveTab('bb84')}
                    style={{ padding: '12px 24px' }}
                >
                    <Shield size={18} />
                    BB84 Protocol
                </button>
                <button
                    className={activeTab === 'e91' ? 'btn btn-primary' : 'btn btn-secondary'}
                    onClick={() => setActiveTab('e91')}
                    style={{ padding: '12px 24px' }}
                >
                    <RadioTower size={18} />
                    E91 Protocol
                </button>
            </div>

            {/* Main Simulation Area */}
            <div style={{ width: '100%' }} className="animate-fade-in delay-100">
                {activeTab === 'bb84' && <BB84Simulator />}
                {activeTab === 'e91' && <E91Simulator />}
            </div>

        </div>
    )
}
