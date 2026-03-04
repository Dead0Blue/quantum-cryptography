from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from qkd.bb84 import run_bb84_simulation
from qkd.e91 import run_e91_simulation

app = FastAPI(title="Quantum Cryptography API", version="1.0.0")

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Quantum Cryptography Simulation Backend"}

@app.get("/api/bb84/simulate")
def simulate_bb84(num_bits: int = 10, eve_present: bool = False):
    """
    Simulates the BB84 protocol.
    Args:
        num_bits (int): The number of raw bits to generate.
        eve_present (bool): Whether an eavesdropper is intercepting the quantum channel.
    Returns:
        dict: A comprehensive step-by-step breakdown of the quantum key distribution.
    """
    results = run_bb84_simulation(num_bits, eve_present)
    return results

@app.get("/api/e91/simulate")
def simulate_e91(num_pairs: int = 10, eve_present: bool = False):
    """
    Simulates the E91 protocol.
    Args:
        num_pairs (int): The number of entangled pairs to generate.
        eve_present (bool): Whether an eavesdropper is intercepting.
    Returns:
        dict: A comprehensive step-by-step breakdown of the quantum key distribution.
    """
    results = run_e91_simulation(num_pairs, eve_present)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
