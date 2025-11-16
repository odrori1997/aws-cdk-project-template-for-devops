# Pull Request Guide - Working with Your Own Fork

This guide helps you create pull requests in **your own repository** instead of accidentally pushing to the original repository.

## 🔍 Step 1: Check Your Git Remotes

Before pushing, always verify where your remotes are pointing:

```bash
git remote -v
```

**Expected output:**
- `origin` should point to **your repository** (e.g., `https://github.com/odrori1997/aws-cdk-project-template-for-devops.git`)
- If you see the original repository, you need to update your remotes (see troubleshooting below)

## 📝 Step 2: Commit Your Changes

```bash
# Check what files have changed
git status

# Stage your changes
git add <file-name>
# Or stage all changes:
git add .

# Commit your changes
git commit -m "Your commit message here"
```

## 🚀 Step 3: Push to Your Own Repository

**IMPORTANT:** Always push to `origin` (your repo), not to the original repository.

```bash
# Push your branch to YOUR repository
git push origin <branch-name>

# Example:
git push origin test-ec2-upgrade
```

## 🔗 Step 4: Create Pull Request in YOUR Repository

### Method 1: Use GitHub's Auto-Generated Link

After pushing, GitHub will show you a link like:
```
https://github.com/odrori1997/aws-cdk-project-template-for-devops/pull/new/test-ec2-upgrade
```

**Click this link** - it will create the PR in your repository.

### Method 2: Manual PR Creation

1. Go to **your repository** on GitHub:
   ```
   https://github.com/odrori1997/aws-cdk-project-template-for-devops
   ```

2. Click **"Pull requests"** tab

3. Click **"New pull request"** button

4. **VERIFY THE BASE REPOSITORY:**
   - Base repository dropdown should show: `odrori1997/aws-cdk-project-template-for-devops` (YOUR repo)
   - Base branch: Usually `main` or `master`
   - Compare branch: Your feature branch (e.g., `test-ec2-upgrade`)

5. If the base repository shows the original repo, **change it to your repository** using the dropdown

6. Fill in PR title and description, then click **"Create pull request"**

## ⚠️ Common Pitfalls to Avoid

### ❌ DON'T:
- Don't push directly to the original repository
- Don't create PRs with the original repo as the base
- Don't use `git push upstream` if you have an upstream remote pointing to the original

### ✅ DO:
- Always check `git remote -v` before pushing
- Always push to `origin` (your repo)
- Always verify the base repository when creating PRs on GitHub
- Double-check the repository name in the PR creation page

## 🔧 Troubleshooting

### If `origin` Points to the Original Repository

If your `origin` is pointing to the original repository, you need to update it:

```bash
# Check current remotes
git remote -v

# Option 1: Update origin to point to your repo
git remote set-url origin https://github.com/odrori1997/aws-cdk-project-template-for-devops.git

# Option 2: Add your repo as origin and keep original as upstream
git remote rename origin upstream
git remote add origin https://github.com/odrori1997/aws-cdk-project-template-for-devops.git
```

### Verify Your Setup

```bash
# Check remotes
git remote -v

# Check current branch
git branch -vv

# Check status
git status
```

## 📋 Quick Reference Checklist

Before creating a PR, make sure:

- [ ] `git remote -v` shows your repo as `origin`
- [ ] Changes are committed (`git status` shows clean working tree)
- [ ] Branch is pushed to your repo (`git push origin <branch>`)
- [ ] PR base repository is YOUR repository, not the original
- [ ] PR compare branch is your feature branch

## 🎯 Quick Commands Summary

```bash
# 1. Check remotes
git remote -v

# 2. Stage and commit
git add .
git commit -m "Your message"

# 3. Push to YOUR repo
git push origin <branch-name>

# 4. Create PR using GitHub link or manually verify base repo is YOURS
```

---

**Remember:** When in doubt, always check `git remote -v` and verify the repository name in the GitHub PR creation page!

