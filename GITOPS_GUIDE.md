# GitOps Multi-Environment Setup

This repository follows GitOps principles with support for multiple environments based on git branches.

## Branch Strategy

```
main (production)
  └── Deployed to: https://enFaust.github.io/GitOps
  └── Automatic deployment on push
  └── Production environment

staging (staging)
  └── Deployed to: https://enFaust.github.io/GitOps-staging
  └── Pre-production testing environment
  └── Automatic deployment on push

develop (development)
  └── Deployed to: https://enFaust.github.io/GitOps-dev
  └── Development/integration environment
  └── Automatic deployment on push
```

## Environment Workflow

### 1. **Development Environment** (develop branch)
- **Purpose**: Integration and testing
- **URL**: `https://enFaust.github.io/GitOps-dev`
- **When to push**: After feature implementation
- **Deployment**: Automatic on push to develop

### 2. **Staging Environment** (staging branch)
- **Purpose**: Pre-production testing
- **URL**: `https://enFaust.github.io/GitOps-staging`
- **When to push**: After code review and testing in development
- **Deployment**: Automatic on push to staging

### 3. **Production Environment** (main branch)
- **Purpose**: Live application
- **URL**: `https://enFaust.github.io/GitOps`
- **When to push**: After staging validation and approval
- **Deployment**: Automatic on push to main
- **Protection**: Should require PR reviews before merging

## Workflow Pipeline

All environments follow this pipeline:

```
Push to Branch
    ↓
Determine Environment (from branch name)
    ↓
Run Tests (Python unit tests)
    ↓
Build Project (copy web files to build dir)
    ↓
Create Environment Metadata
    ↓
Upload Artifact
    ↓
Deploy to GitHub Pages
    ↓
Deployment Summary
```

## GitHub Actions Workflows

### `workflow.yml`
- **Purpose**: Run unit tests and hello.py
- **Trigger**: Push to main branch
- **Jobs**: 
  - hello: Runs hello.py script
  - test: Runs Python unit tests

### `multi-env-deploy.yml`
- **Purpose**: Build and deploy to multiple environments
- **Trigger**: Push to main, staging, or develop branches
- **Jobs**:
  - determine-environment: Sets environment variables
  - build: Builds and prepares artifact
  - test: Runs all tests
  - deploy: Deploys to GitHub Pages

### `deploy.yml` (Legacy)
- **Purpose**: Original single-environment deployment
- **Status**: Can be kept for reference or removed

## Setting Up Multiple Environments

### Step 1: Create Branches
```bash
git branch develop
git branch staging
git push -u origin develop
git push -u origin staging
```

### Step 2: Configure GitHub Pages
Ensure GitHub Pages is enabled with GitHub Actions as the source.

### Step 3: Create Environments (Optional but Recommended)
In repository settings:
1. Go to Settings → Environments
2. Create three environments: development, staging, production
3. Add protection rules for each (e.g., require reviews for production)

### Step 4: Set Branch Protection Rules
For `main` branch:
1. Go to Settings → Branches
2. Add rule for `main`
3. Require PR reviews before merge
4. Require status checks to pass

## Usage Example

### Making Changes Flow Through Environments

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/calculator-improvement

# 2. Make changes and commit
git add .
git commit -m "Improve calculator styling"

# 3. Push feature branch
git push -u origin feature/calculator-improvement

# 4. Create PR to develop
# (Merge after CI passes and review)
git checkout develop
git pull origin develop

# 5. Once stable, create PR from develop to staging
# (For final testing)

# 6. Once validated, create PR from staging to main
# (For production release)
```

## Environment Files

Each deployment creates a metadata file (`ENV.txt`) containing:
- Deployment environment
- Branch name
- Git commit hash
- Deployment timestamp

## Monitoring Deployments

1. **GitHub Actions**: View workflow runs in the Actions tab
2. **Deployment Status**: Check each environment's URL
3. **Environment deployments**: Settings → Environments → View deployment history

## Best Practices

1. **Always test in development first** before promoting to staging
2. **Code review required** for main branch merges
3. **Keep branches in sync** to avoid conflicts
4. **Use meaningful commit messages** for deployment tracking
5. **Monitor environment deployments** after pushing changes
6. **Protect production branch** with branch protection rules
7. **Document environment-specific configs** if needed

## Troubleshooting

### Deployment Failed
- Check GitHub Actions logs for error details
- Ensure all tests pass
- Verify GitHub Pages is enabled

### Changes not deployed
- Check branch name (develop, staging, or main)
- Verify workflow is enabled
- Check if branch protection rules are preventing merge

### Multiple environments not working
- Confirm three branches exist (develop, staging, main)
- Verify multi-env-deploy.yml workflow file
- Check GitHub Pages settings

## Environment Variables

For environment-specific configuration, add to workflow:
```yaml
env:
  API_URL: ${{ secrets.API_URL_${{ env.ENVIRONMENT }} }}
```

## Related Documentation

- [GitHub Workflows](https://docs.github.com/en/actions/using-workflows)
- [GitHub Pages Deployments](https://docs.github.com/en/pages)
- [GitOps Principles](https://opengitops.dev/)
