@echo off
REM LetterEase - Quick Vercel Deployment Script (Windows)
REM This script helps you deploy LetterEase to Vercel quickly

echo.
echo ============================================
echo  LetterEase - Vercel Deployment Helper
echo ============================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo   Download from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Initialize git if not already initialized
if not exist .git (
    echo [*] Initializing Git repository...
    git init
    echo [OK] Git repository initialized
) else (
    echo [OK] Git repository already exists
)

REM Add all files
echo.
echo [*] Adding files to Git...
git add .

REM Commit
echo [*] Committing files...
git commit -m "Initial LetterEase deployment"
if errorlevel 1 (
    git commit -m "Update LetterEase"
)

echo.
echo [OK] Files committed successfully!
echo.
echo ============================================
echo  Next Steps:
echo ============================================
echo.
echo 1. Create a GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name it: letterease
echo    - Click 'Create repository'
echo.
echo 2. Push your code (run these commands):
echo    git remote add origin https://github.com/YOUR_USERNAME/letterease.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy to Vercel:
echo    - Go to: https://vercel.com/new
echo    - Sign in with GitHub
echo    - Import the 'letterease' repository
echo    - Click 'Deploy'
echo.
echo 4. Upload data on deployed site:
echo    - Visit your Vercel URL (e.g., https://letterease.vercel.app)
echo    - Login with password: LetterEase2024
echo    - Upload your Excel file
echo.
echo 5. Share dashboard URLs with your team!
echo.
echo For detailed instructions, see DEPLOY_TO_VERCEL.md
echo.
pause
