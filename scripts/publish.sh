#!/bin/bash

# Maven Blog Publishing Workflow
# Runs security checks before building and deploying

set -e  # Exit on any error

echo "📝 Maven Blog Publishing Workflow"
echo "=================================="
echo ""

# Step 1: Security Scan
echo "Step 1/4: Security Scan"
./scripts/security-scan.sh

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Security issues detected!"
    echo ""
    read -p "Run auto-redaction? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./scripts/auto-redact.sh
        echo ""
        read -p "Review changes and continue? (y/n): " -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Publishing cancelled"
            exit 1
        fi
    else
        echo "❌ Publishing cancelled - please fix security issues manually"
        exit 1
    fi
fi

echo ""
echo "Step 2/4: Building Site"
hugo --cleanDestinationDir

if [ $? -ne 0 ]; then
    echo "❌ Hugo build failed"
    exit 1
fi

echo ""
echo "Step 3/4: Git Commit"
git add .
read -p "Commit message: " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Update blog posts and content"
fi

git commit -m "$commit_msg"

echo ""
echo "Step 4/4: Pushing to GitHub"
# Note: Configure git credentials or use SSH keys instead of tokens in scripts
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Published successfully!"
    echo "🌐 Site will update in 1-2 minutes at https://mavensays.com"
else
    echo ""
    echo "❌ Push failed - check credentials and try again"
    exit 1
fi
