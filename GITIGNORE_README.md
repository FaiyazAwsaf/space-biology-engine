# Git Ignore Strategy

This project uses a comprehensive `.gitignore` strategy to protect sensitive data, large files, and unnecessary build artifacts.

## Structure

```
├── .gitignore                 # Root - covers all common patterns
├── frontend/.gitignore        # Frontend-specific ignores
├── backend/.gitignore         # Backend/Python/ML specific ignores
├── backend/data/.gitignore    # Data directory specific ignores
├── backend/models/.gitignore  # ML models specific ignores
└── backend/kg/.gitignore      # Knowledge graph specific ignores
```

## What's Protected

### 🔐 **Sensitive Data**
- Environment variables (`.env*`)
- API keys and credentials
- Database files (`.db`, `.sqlite3`)
- Configuration secrets

### 🧠 **Machine Learning Assets**
- Trained models (`.pt`, `.safetensors`, `.bin`)
- Model checkpoints (`checkpoint-*/`)
- Training logs and artifacts
- Large datasets (`.csv`, `.arrow`, `.conll`)

### 📊 **Data Files**
- Raw datasets
- Processed data files
- Vector databases (`chroma_db/`)
- Knowledge graph files (`.gml`, `.json`)

### 🏗️ **Build Artifacts**
- Node modules (`node_modules/`)
- Build outputs (`build/`, `dist/`)
- Cache directories
- Temporary files

### 💻 **Development Files**
- IDE configurations (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Log files (`*.log`)
- Backup files (`*.bak`)

## Kept Files

### ✅ **Essential Configs**
- `config.json` files
- `dataset_info.json`
- `tokenizer_config.json`
- Small reference files
- Source code (`.py`, `.tsx`, `.ts`)

## Best Practices

1. **Large Files**: Use Git LFS for files >100MB
2. **Secrets**: Never commit API keys or credentials
3. **Models**: Store trained models in external storage
4. **Data**: Keep sample data, ignore full datasets
5. **Documentation**: Always document data sources

## Commands

```bash
# Check what's ignored
git status --ignored

# Force add ignored file (be careful!)
git add -f filename

# Remove from tracking (keep local)
git rm --cached filename

# Clean ignored files
git clean -fdX
```

## Notes

- The `.gitignore` files are hierarchical (root → subdirectory)
- Patterns in subdirectories override root patterns
- Use `!pattern` to force include specific files
- Large datasets should be documented but not committed