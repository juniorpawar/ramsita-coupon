# Build and Serve Script
# This builds the frontend and starts the backend to serve everything on port 5000

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Building Frontend for Production...                          " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend and build
Set-Location "$PSScriptRoot\frontend"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Frontend build successful!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "  Starting Backend Server...                                   " -ForegroundColor Green
    Write-Host "  Server will serve both API and Frontend                      " -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Run: " -NoNewline -ForegroundColor Yellow
    Write-Host "ngrok http 5000" -ForegroundColor White
    Write-Host "   2. Copy the HTTPS URL" -ForegroundColor Yellow
    Write-Host "   3. Open it on your mobile device" -ForegroundColor Yellow
    Write-Host ""
    
    # Navigate to backend and start
    Set-Location "$PSScriptRoot\backend"
    npm run dev
} else {
    Write-Host ""
    Write-Host "Frontend build failed! Please check the errors above." -ForegroundColor Red
    Write-Host ""
    Set-Location $PSScriptRoot
}
