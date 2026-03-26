# Maven Blog Publishing Scripts

Security-first publishing workflow for Maven's blog.

## Scripts

### 🔒 `security-scan.sh`

Scans blog posts for sensitive information before publishing.

**Detects:**
- Passwords (password: "...")
- API keys (api_key: "...")
- Tokens (token: "...")
- Secrets (secret: "...")
- GitHub Personal Access Tokens (ghp_...)
- Email addresses
- Phone numbers

**Usage:**
```bash
./scripts/security-scan.sh
```

**Exit codes:**
- `0` = Clean (no issues)
- `1` = Issues found

---

### 🔐 `auto-redact.sh`

Automatically redacts sensitive information from blog posts.

**Redacts:**
- Passwords → `******************`
- API keys/tokens → `********************************`
- Email addresses → `[redacted]@[redacted]`
- Phone numbers → `***-***-****`

**Usage:**
```bash
./scripts/auto-redact.sh
```

**Safety:**
- Creates timestamped backup before modifying files
- Preserves file structure (keeps quotes, formatting)
- Shows what was redacted

---

### 📝 `publish.sh`

Complete publishing workflow with security checks.

**Workflow:**
1. Run security scan
2. Auto-redact (if issues found)
3. Build site with Hugo
4. Git commit
5. Push to GitHub

**Usage:**
```bash
./scripts/publish.sh
```

**Interactive prompts:**
- Auto-redaction confirmation
- Commit message
- Review before push

---

## Recommended Workflow

### Publishing a New Blog Post

**Option 1: Manual (Safe)**
```bash
# 1. Check for issues
./scripts/security-scan.sh

# 2. If issues found, auto-redact
./scripts/auto-redact.sh

# 3. Review changes
git diff

# 4. Build and deploy
hugo
git add .
git commit -m "Add new blog post"
git push
```

**Option 2: Automated (One Command)**
```bash
./scripts/publish.sh
```

---

## Security Best Practices

### ✅ DO:
- Run security scan before every commit
- Review auto-redaction changes
- Keep backups of original files
- Use placeholders in examples (`your-api-key`, `example@email.com`)

### ❌ DON'T:
- Commit real credentials
- Skip security scans
- Push without reviewing changes
- Use real email addresses in examples

---

## Patterns Detected

### Passwords
```markdown
password: "MySecret123"  → password: "******************"
Password: MySecret123    → Password: ******************
```

### API Keys
```markdown
api_key: "sk_live_abc123xyz"  → api_key: "********************************"
```

### GitHub Tokens
```markdown
ghp_exampleTokenHere123456789  → ghp_********************************
```

### Emails
```markdown
jed@example.com  → [redacted]@[redacted]
```

### Phone Numbers
```markdown
618-555-1234  → ***-***-****
```

---

## Troubleshooting

### "Permission denied"
```bash
chmod +x scripts/*.sh
```

### "Command not found: perl"
```bash
# macOS
brew install perl

# Linux
sudo apt-get install perl
```

### False Positives

If the scanner flags something that isn't sensitive:

1. **Email placeholders** — Use `user@example.com` (won't be redacted)
2. **Code examples** — Mark with code blocks (may still be redacted for safety)
3. **Manual review** — Always check before committing

---

## Continuous Improvement

These scripts learn as we build. Found a pattern we're missing? Add it to:
- `security-scan.sh` → `PATTERNS` array
- `auto-redact.sh` → `REDACTIONS` array

---

**Built by Maven | Security First | Build in Public**
