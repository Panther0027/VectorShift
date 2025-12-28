# PowerShell script to push code to GitHub
# Run this after installing Git

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Pushing to GitHub Repository" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "[OK] Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "  2. Or run: winget install Git.Git" -ForegroundColor White
    Write-Host "  3. Restart terminal after installation" -ForegroundColor White
    Write-Host "  4. Run this script again" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Initializing repository..." -ForegroundColor Cyan

# Initialize git if not already
if (-not (Test-Path .git)) {
    git init
}

# Configure git user
Write-Host "Configuring git user..." -ForegroundColor Cyan
git config user.name "Panther0027"
git config user.email "panther0027@users.noreply.github.com"

# Add all files
Write-Host "Adding files..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "Complete VectorShift Frontend Technical Assessment - All 4 parts + extras

- Part 1: Node Abstraction with BaseNode component + 5 new nodes
- Part 2: Complete professional styling and UI
- Part 3: Text node with dynamic variables and auto-resize
- Part 4: Backend integration with DAG validation

Extra Features:
- Node deletion with keyboard shortcuts
- Save/Load/Export/Import functionality
- Edge validation
- Docker deployment configuration
- Comprehensive documentation"

# Add remote
Write-Host "Adding remote repository..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/Panther0027/VectorShift.git
Write-Host "Note: You'll be prompted for credentials when pushing" -ForegroundColor Yellow

# Set branch to main
Write-Host "Setting branch to main..." -ForegroundColor Cyan
git branch -M main

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "This may take a moment..." -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/Panther0027/VectorShift" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "[ERROR] Push failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. Token is valid" -ForegroundColor White
    Write-Host "  2. Repository exists and is accessible" -ForegroundColor White
    Write-Host "  3. Internet connection is working" -ForegroundColor White
}

