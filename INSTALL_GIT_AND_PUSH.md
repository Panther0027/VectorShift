# 🚀 Install Git and Push to GitHub

## Git is Not Installed - Here's How to Fix It

### Option 1: Install Git (Recommended)

**Windows:**
1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (just click Next)
4. **Restart your terminal/PowerShell** after installation

**OR use Windows Package Manager:**
```powershell
winget install Git.Git
```

**After installation:**
1. Close and reopen your terminal
2. Verify: `git --version`
3. Run the push script I created

---

### Option 2: Use the Script I Created

I've created a script `push_to_github.ps1` that will:
- Check if Git is installed
- Initialize repository
- Add all files
- Commit with message
- Push to your GitHub repository

**To run it:**
```powershell
.\push_to_github.ps1
```

---

### Option 3: Manual Steps (After Installing Git)

Once Git is installed, run these commands:

```powershell
# Initialize
git init

# Configure
git config user.name "Panther0027"
git config user.email "panther0027@users.noreply.github.com"

# Add files
git add .

# Commit
git commit -m "Complete VectorShift Frontend Technical Assessment - All 4 parts + extras"

# Add remote (use token when prompted)
git remote add origin https://github.com/Panther0027/VectorShift.git
# When prompted for password, use your GitHub Personal Access Token

# Push
git branch -M main
git push -u origin main
```

---

## 🔐 Security Note

The token is embedded in the script for convenience. After pushing:
1. The code will be on GitHub
2. You can revoke the token at: https://github.com/settings/tokens
3. Future pushes can use SSH keys (more secure)

---

## ✅ Quick Steps

1. **Install Git:** https://git-scm.com/download/win
2. **Restart terminal**
3. **Run:** `.\push_to_github.ps1`
4. **Done!** Code will be on GitHub

---

## 📝 Alternative: Use GitHub Desktop

If you prefer a GUI:
1. Download: https://desktop.github.com/
2. Sign in with your GitHub account
3. Add repository: https://github.com/Panther0027/VectorShift
4. Drag and drop files
5. Commit and push

---

**After installing Git, just run the script and your code will be pushed! 🚀**

