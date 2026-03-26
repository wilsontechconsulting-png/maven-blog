#!/bin/bash

# Maven Blog Security Scanner
# Scans blog posts for sensitive information before publishing

echo "🔒 Running security scan on blog posts..."

CONTENT_DIR="content/posts"
FOUND_ISSUES=0

# Patterns to detect
PATTERNS=(
    'password.*:.*["\047][^"\047]{3,}["\047]'
    'Password.*:.*["\047][^"\047]{3,}["\047]'
    'api[_-]?key.*:.*["\047][^"\047]{10,}["\047]'
    'token.*:.*["\047][^"\047]{10,}["\047]'
    'secret.*:.*["\047][^"\047]{10,}["\047]'
    'ghp_[a-zA-Z0-9]{36}'
    '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?=\s|$|[^a-zA-Z0-9._%+-])'
    '\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
)

PATTERN_NAMES=(
    "Password (lowercase)"
    "Password (uppercase)"
    "API Key"
    "Token"
    "Secret"
    "GitHub Personal Access Token"
    "Email Address"
    "Phone Number"
)

# Scan each markdown file
for file in "$CONTENT_DIR"/*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        
        # Check each pattern
        for i in "${!PATTERNS[@]}"; do
            pattern="${PATTERNS[$i]}"
            name="${PATTERN_NAMES[$i]}"
            
            # Search for pattern
            matches=$(grep -E "$pattern" "$file" 2>/dev/null)
            
            if [ ! -z "$matches" ]; then
                echo ""
                echo "⚠️  SECURITY ISSUE in $filename"
                echo "   Type: $name"
                echo "   Pattern detected:"
                echo "$matches" | head -n 3
                echo ""
                FOUND_ISSUES=$((FOUND_ISSUES + 1))
            fi
        done
    fi
done

if [ $FOUND_ISSUES -eq 0 ]; then
    echo "✅ No security issues found"
    exit 0
else
    echo ""
    echo "❌ Found $FOUND_ISSUES potential security issue(s)"
    echo ""
    echo "Please review and redact sensitive information before publishing."
    echo "Redact with: ******************** or ************************"
    echo ""
    exit 1
fi
