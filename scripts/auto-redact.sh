#!/bin/bash

# Maven Blog Auto-Redaction Tool
# Automatically redacts sensitive information from blog posts

echo "🔐 Auto-redacting sensitive information..."

CONTENT_DIR="content/posts"
REDACTED_COUNT=0

# Backup before modifying
BACKUP_DIR="content/posts/.backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp "$CONTENT_DIR"/*.md "$BACKUP_DIR/" 2>/dev/null

echo "📁 Backup created: $BACKUP_DIR"
echo ""

# Redaction patterns
declare -A REDACTIONS=(
    # Passwords (keep quotes, redact content)
    ['s/([pP]assword.*[:"]\s*)[^"\047]{3,}(["\047])/\1******************\2/g']="Passwords"
    
    # API keys and tokens
    ['s/(api[_-]?key.*[:"]\s*)[^"\047]{10,}(["\047])/\1********************************\2/gi']="API Keys"
    ['s/(token.*[:"]\s*)[^"\047]{10,}(["\047])/\1********************************\2/gi']="Tokens"
    ['s/(secret.*[:"]\s*)[^"\047]{10,}(["\047])/\1********************************\2/gi']="Secrets"
    
    # GitHub tokens (specific format)
    ['s/ghp_[a-zA-Z0-9]{36}/ghp_********************************/g']="GitHub Tokens"
    
    # Email addresses (preserve structure, redact domain)
    ['s/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/[redacted]@[redacted]/g']="Email Addresses"
    
    # Phone numbers
    ['s/\b(\d{3})[-.]?(\d{3})[-.]?(\d{4})\b/***-***-****/g']="Phone Numbers"
)

# Process each file
for file in "$CONTENT_DIR"/*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        changed=0
        
        for pattern in "${!REDACTIONS[@]}"; do
            # Apply redaction
            if perl -i -pe "$pattern" "$file" 2>/dev/null; then
                # Check if file was actually modified
                if ! diff -q "$file" "$BACKUP_DIR/$filename" > /dev/null 2>&1; then
                    type="${REDACTIONS[$pattern]}"
                    echo "✅ Redacted $type in $filename"
                    changed=1
                    REDACTED_COUNT=$((REDACTED_COUNT + 1))
                fi
            fi
        done
    fi
done

echo ""

if [ $REDACTED_COUNT -eq 0 ]; then
    echo "✅ No sensitive information found - files are clean"
    rm -rf "$BACKUP_DIR"
else
    echo "✅ Redacted $REDACTED_COUNT item(s)"
    echo "📁 Original files backed up to: $BACKUP_DIR"
    echo ""
    echo "⚠️  Review changes before committing!"
fi
