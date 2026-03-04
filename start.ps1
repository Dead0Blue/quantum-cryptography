# Start script for the Quantum Cryptography Educational Platform

Write-Host "Starting the Quantum Cryptography Platform..." -ForegroundColor Cyan

# Start the Python FastAPI backend in a new window using the virtual environment
Write-Host "Starting Python FastAPI Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; .\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000`""

# Start the Next.js frontend in a new window
Write-Host "Starting Next.js Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev -- -p 3000`""

# Wait a few seconds for servers to initialize, then open the browser
Write-Host "Waiting for servers to initialize..." -ForegroundColor Magentax
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "Both servers are starting up!" -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000"
Write-Host "Backend API is running at: http://localhost:8000"
