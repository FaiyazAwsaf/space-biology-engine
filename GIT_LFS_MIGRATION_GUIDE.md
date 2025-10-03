# Git LFS Migration Guide - Space Biology Engine

## 🚨 Current Situation
You have large files already committed to Git history:
- **Model files**: `backend/models/models/ner_v1_15papers/*.safetensors` (254MB each)
- **Optimizer**: `backend/models/models/ner_v1_15papers/checkpoint-9/optimizer.pt` (507MB)
- **Knowledge graphs**: `backend/kg/knowledge_graph.json` (39MB), `backend/kg/knowledge_graph.gml` (30MB)

## 📋 Step-by-Step Migration Process

### **OPTION 1: Clean Migration (Recommended)**

#### Step 1: Backup Your Work
```bash
# Create a backup branch
git checkout -b backup-before-lfs
git push origin backup-before-lfs
git checkout main
```

#### Step 2: Set Up LFS Tracking
```bash
# Initialize LFS (already done)
git lfs install

# Track your file patterns (already done)
git lfs track "*.safetensors"
git lfs track "*.pt"
git lfs track "backend/kg/*.json"
git lfs track "backend/kg/*.gml"

# Add .gitattributes
git add .gitattributes
git commit -m "Add LFS tracking configuration"
```

#### Step 3: Migrate Existing History
```bash
# Migrate all history to move large files to LFS
git lfs migrate import --include="*.safetensors,*.pt,backend/kg/*.json,backend/kg/*.gml" --everything

# This rewrites Git history, moving large files to LFS
```

#### Step 4: Force Push (⚠️ WARNING: This rewrites history)
```bash
# Push the rewritten history
git push origin main --force-with-lease

# Verify LFS files
git lfs ls-files
```

### **OPTION 2: Fresh Start (If Migration Fails)**

#### Step 1: Remove Large Files from Tracking
```bash
# Remove large files from current commit
git rm --cached backend/models/models/ner_v1_15papers/*.safetensors
git rm --cached backend/models/models/ner_v1_15papers/checkpoint-9/optimizer.pt
git rm --cached backend/kg/knowledge_graph.json
git rm --cached backend/kg/knowledge_graph.gml

# Commit the removal
git commit -m "Remove large files from Git tracking"
```

#### Step 2: Add Files via LFS
```bash
# Now add them back via LFS
git add backend/models/models/ner_v1_15papers/*.safetensors
git add backend/models/models/ner_v1_15papers/checkpoint-9/optimizer.pt
git add backend/kg/knowledge_graph.json
git add backend/kg/knowledge_graph.gml

# Commit via LFS
git commit -m "Add large files via Git LFS"
```

#### Step 3: Push Changes
```bash
git push origin main
```

## 🔍 Verification Commands

### Check LFS Status
```bash
# See what files are tracked by LFS
git lfs ls-files

# Check LFS tracking patterns
cat .gitattributes

# Verify file sizes in repository
git lfs pointer --file=backend/models/models/ner_v1_15papers/model.safetensors
```

### Check Repository Size
```bash
# Before LFS migration
du -sh .git

# After LFS migration (should be much smaller)
du -sh .git
```

## 🎯 Expected Results

After successful LFS setup:
- ✅ Large files show as "LFS pointers" (small text files)
- ✅ Repository `.git` folder is much smaller
- ✅ `git lfs ls-files` shows your tracked files
- ✅ GitHub shows LFS badge on large files
- ✅ Clone/push operations are faster

## 🚨 Team Collaboration Notes

After setting up LFS, tell your team members:
1. **Install Git LFS**: `sudo apt install git-lfs` (or their OS equivalent)
2. **Initialize LFS**: `git lfs install` (one-time setup)
3. **Clone normally**: `git clone <repo>` (LFS files download automatically)

## 📊 Storage Limits (GitHub)

| Plan | LFS Storage | LFS Bandwidth |
|------|-------------|---------------|
| Free | 1 GB | 1 GB/month |
| Pro | 1 GB | 1 GB/month |
| Team | 2 GB | 2 GB/month |

Your current large files (~1.5GB total) will fit in the free tier, but watch your bandwidth usage.

## 🆘 Troubleshooting

### If Migration Fails:
- Use OPTION 2 (Fresh Start)
- Or contact me for alternative approaches

### If Push Fails:
```bash
# Check LFS status
git lfs status

# Push LFS files separately
git lfs push origin main --all
```

### If Clone is Slow:
```bash
# Clone without LFS files first
GIT_LFS_SKIP_SMUDGE=1 git clone <repo>
cd <repo>
git lfs pull
```