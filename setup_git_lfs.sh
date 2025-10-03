#!/bin/bash
# Git LFS Setup Script for Space Biology Engine
# Run this script from your project root directory

set -e  # Exit on any error

echo "🚀 Setting up Git LFS for Space Biology Engine"
echo "================================================"

# Step 1: Verify Git LFS is installed
echo "Step 1: Checking Git LFS installation..."
if git lfs version > /dev/null 2>&1; then
    echo "✅ Git LFS is installed: $(git lfs version)"
else
    echo "❌ Git LFS not found. Please install it first:"
    echo "   sudo apt install git-lfs  # Ubuntu/Debian"
    echo "   brew install git-lfs      # macOS"
    exit 1
fi

# Step 2: Initialize Git LFS
echo -e "\nStep 2: Initializing Git LFS..."
git lfs install
echo "✅ Git LFS initialized"

# Step 3: Track large file patterns
echo -e "\nStep 3: Configuring LFS tracking..."
git lfs track "*.safetensors"
git lfs track "*.pt" 
git lfs track "backend/kg/*.json"
git lfs track "backend/kg/*.gml"
echo "✅ LFS tracking configured"

# Step 4: Show what's being tracked
echo -e "\nStep 4: Current LFS tracking patterns:"
cat .gitattributes

# Step 5: Add .gitattributes
echo -e "\nStep 5: Adding .gitattributes to Git..."
git add .gitattributes
echo "✅ .gitattributes added"

# Step 6: Check current status
echo -e "\nStep 6: Current Git status:"
git status --porcelain

# Step 7: Migrate existing large files (if they exist in history)
echo -e "\nStep 7: Checking for existing large files in Git history..."
LARGE_FILES=$(git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -10)

if echo "$LARGE_FILES" | grep -q '[0-9]\{8\}'; then
    echo "⚠️  Found large files in Git history. Migration recommended."
    echo "   Run this command to migrate:"
    echo "   git lfs migrate import --include=\"*.safetensors,*.pt,backend/kg/*.json,backend/kg/*.gml\" --everything"
    echo ""
    echo "   Then force push to update remote:"
    echo "   git push origin main --force-with-lease"
else
    echo "✅ No problematic large files found in history"
fi

echo -e "\n🎉 Git LFS setup complete!"
echo "Next steps:"
echo "1. Commit your changes: git commit -m 'Add LFS tracking for large files'"
echo "2. Add large files: git add backend/models/ backend/kg/"
echo "3. Commit large files: git commit -m 'Add model files and knowledge graphs via LFS'"
echo "4. Push to remote: git push origin main"