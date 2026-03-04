# Start script for the Quantum Cryptography Educational Platform

Write-Host "Starting the Quantum Cryptography Platform..." -ForegroundColor Cyan

# Start the Python FastAPI backend in a new window
Write-Host "Starting Python FastAPI Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; uvicorn main:app --reload`""

# Start the Next.js frontend in a new window
Write-Host "Starting Next.js Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""

Write-Host "Both servers are starting up!" -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000"
Write-Host "Backend API is running at: http://localhost:8000"
