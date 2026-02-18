#!/bin/bash

# LetterEase - Quick Vercel Deployment Script
# This script helps you deploy LetterEase to Vercel quickly

echo "🚀 LetterEase - Vercel Deployment Helper"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   - Windows: https://git-scm.com/download/win"
    echo "   - Mac: brew install git"
    echo "   - Linux: sudo apt-get install git"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo ""
echo "📝 Adding files to Git..."
git add .

# Commit
echo "💾 Committing files..."
git commit -m "Initial LetterEase deployment" || git commit -m "Update LetterEase"

echo ""
echo "✅ Files committed successfully!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to: https://github.com/new"
echo "   - Name it: letterease"
echo "   - Click 'Create repository'"
echo ""
echo "2. Push your code (run these commands):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/letterease.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to: https://vercel.com/new"
echo "   - Sign in with GitHub"
echo "   - Import the 'letterease' repository"
echo "   - Click 'Deploy'"
echo ""
echo "4. Upload data on deployed site:"
echo "   - Visit your Vercel URL (e.g., https://letterease.vercel.app)"
echo "   - Login with password: LetterEase2024"
echo "   - Upload your Excel file"
echo ""
echo "5. Share dashboard URLs with your team!"
echo ""
echo "📖 For detailed instructions, see DEPLOY_TO_VERCEL.md"
echo ""
