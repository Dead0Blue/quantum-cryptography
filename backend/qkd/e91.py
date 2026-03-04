import random
import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

def run_e91_simulation(num_pairs: int, eve_present: bool) -> dict:
    """
    Simulates the E91 protocol using Qiskit.
    Alice and Bob measure entangled pairs using 3 bases each to test CHSH inequality
    and generate a secure key.
    
    Alice bases: A1 (0), A2 (pi/4), A3 (pi/2)
    Bob bases: B1 (pi/4), B2 (pi/2), B3 (3pi/4)
    """
    # Define measurement bases angles (in radians)
    # Alice: Z (0), X+Z (pi/4), X (pi/2)
    alice_angles = {'A1': 0, 'A2': np.pi / 4, 'A3': np.pi / 2}
    # Bob: X+Z (pi/4), X (pi/2), X-Z (3pi/4)
    bob_angles = {'B1': np.pi / 4, 'B2': np.pi / 2, 'B3': 3 * np.pi / 4}
    
    alice_bases = [random.choice(list(alice_angles.keys())) for _ in range(num_pairs)]
    bob_bases = [random.choice(list(bob_angles.keys())) for _ in range(num_pairs)]
    
    alice_results = []
    bob_results = []
    
    simulator = AerSimulator()
    
    for i in range(num_pairs):
        qc = QuantumCircuit(2, 2)
        
        # Create Entangled Bell State |Phi+> = 1/sqrt(2) (|00> + |11>)
        qc.h(0)
        qc.cx(0, 1)
        
        # If Eve is present, she measures the entangled particles (destroying entanglement)
        if eve_present:
            # Eve intercepts and measures in an arbitrary basis (e.g., Z)
            qc.measure(0, 0)
            qc.measure(1, 1)
            # We don't need to actually record Eve's bits for this demo, just force collapse
            
        # Alice measures Qubit 0
        a_angle = alice_angles[alice_bases[i]]
        qc.ry(-a_angle, 0) # Rotate to measurement basis
        qc.measure(0, 0)
        
        # Bob measures Qubit 1
        b_angle = bob_angles[bob_bases[i]]
        qc.ry(-b_angle, 1) # Rotate to measurement basis
        qc.measure(1, 1)
        
        # Execute
        result = simulator.run(qc, shots=1).result()
        counts = result.get_counts(qc)
        outcome = list(counts.keys())[0] # String like '01' (Bob is first char, Alice is second char due to Qiskit endianness)
        
        bob_res, alice_res = int(outcome[0]), int(outcome[1])
        alice_results.append(alice_res)
        bob_results.append(bob_res)
        
    # SIFTING
    # For key generation, Alice and Bob use bases that match perfectly or anti-match?
    # Actually, in E91 with these bases:
    # A2 and B1 are both pi/4 (Match)
    # A3 and B2 are both pi/2 (Match)
    
    sifted_key_alice = []
    sifted_key_bob = []
    
    for i in range(num_pairs):
        if (alice_bases[i] == 'A2' and bob_bases[i] == 'B1') or \
           (alice_bases[i] == 'A3' and bob_bases[i] == 'B2'):
            sifted_key_alice.append(alice_results[i])
            sifted_key_bob.append(bob_results[i])
            
    # Calculate error rate in sifted key
    errors = sum(1 for a, b in zip(sifted_key_alice, sifted_key_bob) if a != b)
    error_rate = errors / len(sifted_key_alice) if sifted_key_alice else 0
    is_secure = error_rate < 0.15
            
    return {
        "num_pairs": num_pairs,
        "eve_present": eve_present,
        "alice": {
            "bases": alice_bases,
            "results": alice_results
        },
        "bob": {
            "bases": bob_bases,
            "results": bob_results
        },
        "sifting": {
            "sifted_key_alice": sifted_key_alice,
            "sifted_key_bob": sifted_key_bob,
            "error_rate": error_rate,
            "is_secure": is_secure,
            "errors_count": errors
        }
    }
