import random
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def run_bb84_simulation(num_bits: int, eve_present: bool) -> dict:
    """
    Simulates the BB84 protocol using Qiskit.
    Returns the step-by-step state for visualization.
    """
    # 1. Alice generates random bits and bases
    alice_bits = [random.choice([0, 1]) for _ in range(num_bits)]
    alice_bases = [random.choice(['Z', 'X']) for _ in range(num_bits)]
    
    # 2. Bob generates random bases for measurement
    bob_bases = [random.choice(['Z', 'X']) for _ in range(num_bits)]
    
    # Optional: Eve generates random bases for interception
    eve_bases = [random.choice(['Z', 'X']) for _ in range(num_bits)] if eve_present else []
    
    bob_results = []
    eve_results = []
    
    simulator = AerSimulator()
    
    # Simulate single photon transmissions
    for i in range(num_bits):
        qc = QuantumCircuit(1, 1)
        
        # Alice prepares the state
        if alice_bits[i] == 1:
            qc.x(0) # |1> state
            
        if alice_bases[i] == 'X':
            qc.h(0) # Prepare in Hadamard basis
            
        # Eve intercepts and measures
        if eve_present:
            if eve_bases[i] == 'X':
                qc.h(0)
            qc.measure(0, 0)
            
            # Execute Eve's measurement
            result = simulator.run(qc, shots=1).result()
            counts = result.get_counts(qc)
            eve_bit = int(list(counts.keys())[0])
            eve_results.append(eve_bit)
            
            # Eve re-prepares the state based on her measurement
            qc = QuantumCircuit(1, 1)
            if eve_bit == 1:
                qc.x(0)
            if eve_bases[i] == 'X':
                qc.h(0)
                
        # Bob measures
        if bob_bases[i] == 'X':
            qc.h(0) # Measure in Hadamard basis
            
        qc.measure(0, 0)
        
        # Execute Bob's measurement
        result = simulator.run(qc, shots=1).result()
        counts = result.get_counts(qc)
        bob_results.append(int(list(counts.keys())[0]))
        
    # Sifting and error checking
    sifted_key_alice = []
    sifted_key_bob = []
    
    for i in range(num_bits):
        if alice_bases[i] == bob_bases[i]:
            sifted_key_alice.append(alice_bits[i])
            sifted_key_bob.append(bob_results[i])
            
    # Calculate error rate in the sifted key
    errors = sum(1 for a, b in zip(sifted_key_alice, sifted_key_bob) if a != b)
    error_rate = errors / len(sifted_key_alice) if sifted_key_alice else 0
    
    # QBER threshold for detecting Eve is typically ~11%
    is_secure = error_rate < 0.11

    return {
        "num_bits": num_bits,
        "eve_present": eve_present,
        "alice": {
            "bits": alice_bits,
            "bases": alice_bases,
        },
        "bob": {
            "bases": bob_bases,
            "results": bob_results,
        },
        "eve": {
            "bases": eve_bases if eve_present else None,
            "results": eve_results if eve_present else None,
        },
        "sifting": {
            "sifted_key_alice": sifted_key_alice,
            "sifted_key_bob": sifted_key_bob,
            "error_rate": error_rate,
            "is_secure": is_secure,
            "errors_count": errors
        }
    }
