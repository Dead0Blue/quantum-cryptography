# Quantum Cryptography Educational Platform

A complete simulation platform to learn and visualize how Quantum Key Distribution (QKD) protocols work. This visual platform allows you to interact with actual quantum physics simulations representing fundamental protocols like **BB84** and **E91**.

## Tech Stack
* **Frontend**: Next.js, React, Vanilla CSS (Glassmorphism design)
* **Backend**: Python, FastAPI
* **Quantum Engine**: IBM's Qiskit (`qiskit-aer` simulator)

## Features
* **BB84 Intercept-Resend Simulation**: Send photons individually using defined polarization bases, visualize Bob's receipt rate, and test eavesdropper (Eve) presence.
* **E91 Entanglement Simulation**: Create Bell states, distribute entangled pairs, and use CHSH inequality violation detection.
* **Security Reporting**: Calculates Quantum Bit Error Rate (QBER) and determines channel security automatically.

## How to Run

A startup script is provided for Windows PowerShell. Run the following command from this directory:

```powershell
.\start.ps1
```

This will automatically launch two PowerShell windows:
1. The Python FastAPI backend API (Running on http://localhost:8000)
2. The Next.js frontend Dashboard (Running on http://localhost:3000)

