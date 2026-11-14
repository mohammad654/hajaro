#!/usr/bin/env bash
# deploy-hajaro.sh — Push Angular app to GitHub & deploy to GitHub Pages
# Usage: bash deploy-hajaro.sh
# Requires: git, node/npm, Angular CLI, angular-cli-ghpages, curl, gh (optional)

set -euo pipefail

REPO_USER="mohammad654"
REPO_NAME="hajaro"
REMOTE_URL="https://github.com/${REPO_USER}/${REPO_NAME}.git"
BASE_HREF="/${REPO_NAME}/"
LIVE_URL="https://${REPO_USER}.github.io/${REPO_NAME}/"

echo "==> 1/6 Checking environment"
command -v git >/dev/null || { echo "git not found"; exit 1; }
command -v npx >/dev/null || { echo "npx (Node.js) not found"; exit 1; }
[ -f "angular.json" ] || { echo "ERROR: run this inside the Angular project root (angular.json not found)"; exit 1; }

echo "==> 2/6 Ensuring Git repo + remote"
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$REMOTE_URL"
else
  git remote set-url origin "$REMOTE_URL"
fi

# Ensure a README exists (safe if already present)
[ -f README.md ] || echo "# ${REPO_NAME}" > README.md

echo "==> 3/6 Committing and pushing source to 'main'"
git add .
git diff --cached --quiet || git commit -m "Deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git branch -M main
git push -u origin main

echo "==> 4/6 Building & deploying to 'gh-pages'"
# Install gh-pages deployer if not already present
if ! npx --no-install angular-cli-ghpages --version >/dev/null 2>&1; then
  echo "    Installing angular-cli-ghpages..."
  npm install --save-dev angular-cli-ghpages
fi

# Build + deploy (creates/updates the gh-pages branch)
npx ng deploy --base-href="${BASE_HREF}" --no-silent

echo "==> 5/6 Verifying GitHub Pages config"
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  # If Pages isn't enabled yet, enable it from the gh-pages branch
  if ! gh api "repos/${REPO_USER}/${REPO_NAME}/pages" >/dev/null 2>&1; then
    echo "    Enabling GitHub Pages from gh-pages branch..."
    gh api -X POST "repos/${REPO_USER}/${REPO_NAME}/pages" \
      -f source[branch]=gh-pages -f source[path]=/ >/dev/null
  fi
  gh api "repos/${REPO_USER}/${REPO_NAME}/pages" --jq '{status, html_url, source}'
else
  echo "    (gh CLI not available/logged in — enable Pages manually:"
  echo "     Settings > Pages > Source: 'gh-pages' branch, folder '/ (root)')"
fi

echo "==> 6/6 Waiting for live site and verifying"
for i in $(seq 1 20); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$LIVE_URL" || echo "000")
  if [ "$CODE" = "200" ]; then
    echo "    Live! HTTP $CODE — $LIVE_URL"
    break
  fi
  echo "    Attempt $i/20: HTTP $CODE — retrying in 15s..."
  sleep 15
done

echo
echo "Done. Live URL: $LIVE_URL"
echo "If you still see a 404 in the browser, hard-refresh (Ctrl+Shift+R) or use an incognito window."