# Conditional Workflow Examples

## Overview

The multi-env-deploy workflow uses `if:` conditionals and environment variables to customize behavior based on which branch is being deployed.

## Example 1: Branch-Specific Build Optimizations

### Development (develop branch)
```yaml
- name: "[DEV] Build with verbose logging"
  if: needs.determine-environment.outputs.is_development == 'true'
  run: |
    echo "📝 Building in development mode..."
    DEBUG=true npm run build
    echo "Full logs available for debugging"
```

**Result**: Verbose output for troubleshooting

### Staging (staging branch)
```yaml
- name: "[STAGING] Run extended tests"
  if: needs.determine-environment.outputs.is_staging == 'true'
  run: |
    npm run test:extended
    npm run performance:check
```

**Result**: More comprehensive testing

### Production (main branch)
```yaml
- name: "[PROD] Run optimization checks"
  if: needs.determine-environment.outputs.is_production == 'true'
  run: |
    npm run optimize
    npm run bundle-analysis
```

**Result**: Optimized for performance

---

## Example 2: Conditional Testing

### Development - Minimal Testing
```yaml
- name: "[DEV] Run basic tests only"
  if: needs.determine-environment.outputs.is_development == 'true'
  run: |
    python3 -m unittest tests.test_calculator -v
    # Just core calculator tests
```

### Staging/Production - Full Test Suite
```yaml
- name: "[STAGING/PROD] Run complete test suite"
  if: needs.determine-environment.outputs.is_development == 'false'
  run: |
    python3 -m unittest discover -s tests -p "test_*.py" -v
    npm run lint
    npm run security:check
```

---

## Example 3: Security and Validation

### Security Scan - Only for Staging/Production
```yaml
security-scan:
  needs: determine-environment
  runs-on: ubuntu-latest
  if: needs.determine-environment.outputs.is_production == 'true' || needs.determine-environment.outputs.is_staging == 'true'
  steps:
    - name: Run security scan
      run: |
        npm audit
        # Only runs for staging and production
```

### Production Pre-Deployment Checks
```yaml
- name: "[PROD] Pre-deployment checks"
  if: needs.determine-environment.outputs.is_production == 'true'
  run: |
    echo "Security scan passed"
    echo "Performance benchmarks OK"
    echo "All tests passed"
    # Only runs before production deployment
```

---

## Example 4: Environment-Specific Configuration

### Generated config.js
```javascript
const CONFIG = {
  environment: "${{ needs.determine-environment.outputs.environment }}",
  debugMode: ${{ needs.determine-environment.outputs.debug_mode }},
  analyticsEnabled: ${{ needs.determine-environment.outputs.analytics_enabled }},
  apiTimeout: ${{ needs.determine-environment.outputs.is_production == 'true' && '5000' || '30000' }},
  cacheEnabled: ${{ needs.determine-environment.outputs.is_production == 'true' && 'true' || 'false' }}
};
```

**Results**:
- **Development**: `debugMode: true, apiTimeout: 30000, cacheEnabled: false`
- **Staging**: `debugMode: true, apiTimeout: 15000, cacheEnabled: true`
- **Production**: `debugMode: false, apiTimeout: 5000, cacheEnabled: true`

---

## Example 5: Conditional Notifications

### Development - Simple Logging
```yaml
- name: "[DEV] Log deployment"
  if: needs.determine-environment.outputs.is_development == 'true'
  run: echo "📝 Development deployment logged"
```

### Staging - Full Notification
```yaml
- name: "[STAGING] Send notification"
  if: needs.determine-environment.outputs.is_staging == 'true'
  run: |
    # Send Slack/Email notification
    echo "📢 Staging deployment notification sent"
    echo "URL: https://enFaust.github.io/GitOps-staging"
```

### Production - Alert Team
```yaml
- name: "[PROD] Send notification"
  if: needs.determine-environment.outputs.is_production == 'true'
  run: |
    # Send alerts to PagerDuty, Slack, etc.
    echo "🚨 Production deployment notification sent"
    echo "URL: https://enFaust.github.io/GitOps"
```

---

## Example 6: Using Multiple Conditions

### Run only for Production OR Staging
```yaml
- name: Run comprehensive checks
  if: needs.determine-environment.outputs.is_production == 'true' || needs.determine-environment.outputs.is_staging == 'true'
  run: echo "Running checks for production or staging"
```

### Run only for Development AND specific conditions
```yaml
- name: Development debug step
  if: needs.determine-environment.outputs.is_development == 'true' && github.actor == 'enFaust'
  run: echo "This runs only in development and specific actor"
```

### Run everywhere EXCEPT Production
```yaml
- name: Run testing
  if: needs.determine-environment.outputs.is_production == 'false'
  run: python3 -m unittest discover -s tests -p "test_*.py" -v
```

---

## Example 7: Environment Variable Usage in Scripts

```yaml
- name: Deploy with environment variables
  env:
    ENV: ${{ needs.determine-environment.outputs.environment }}
    DEBUG: ${{ needs.determine-environment.outputs.debug_mode }}
    ANALYTICS: ${{ needs.determine-environment.outputs.analytics_enabled }}
  run: |
    echo "Environment: $ENV"
    echo "Debug Mode: $DEBUG"
    echo "Analytics: $ANALYTICS"
    
    if [[ "$ENV" == "production" ]]; then
      # Production-specific deployment
      ./scripts/deploy-prod.sh
    elif [[ "$ENV" == "staging" ]]; then
      # Staging-specific deployment
      ./scripts/deploy-staging.sh
    else
      # Development deployment
      ./scripts/deploy-dev.sh
    fi
```

---

## Key Patterns

### Pattern 1: Environment-Specific Commands
```yaml
run: |
  case "${{ needs.determine-environment.outputs.environment }}" in
    production)
      echo "Running production deployment"
      ;;
    staging)
      echo "Running staging deployment"
      ;;
    development)
      echo "Running development deployment"
      ;;
  esac
```

### Pattern 2: Conditional Execution
```yaml
if: >-
  needs.determine-environment.outputs.is_production == 'true' &&
  github.event_name == 'push'
```

### Pattern 3: Boolean Logic
```yaml
if: |
  (needs.determine-environment.outputs.is_staging == 'true' ||
   needs.determine-environment.outputs.is_production == 'true') &&
  github.ref_type == 'branch'
```

---

## Deployment Comparison

| Aspect | Dev | Staging | Production |
|--------|-----|---------|------------|
| **Debug Mode** | ✓ | ✓ | ✗ |
| **Analytics** | ✗ | ✓ | ✓ |
| **Security Scan** | ✗ | ✓ | ✓ |
| **Optimization Check** | ✗ | ✗ | ✓ |
| **Full Test Suite** | ✗ | ✓ | ✓ |
| **Cache Enabled** | ✗ | ✓ | ✓ |
| **Notifications** | Logs | Alert | Critical Alert |
| **Pre-Deploy Checks** | ✗ | ✗ | ✓ |

---

## Benefits In Action

✅ **Faster Development**: Dev skips unnecessary checks and tests
✅ **Safer Production**: Prod has extra validation and security checks  
✅ **Balanced Staging**: Gets full testing but faster than production
✅ **Automatic**: No manual configuration needed - branch name determines behavior
✅ **Flexible**: Easy to add new conditional logic
