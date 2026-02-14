# Environment Variables Documentation

## Workflow Variables

The `multi-env-deploy.yml` workflow uses conditional statements and environment-specific variables to customize behavior per environment.

### Environment Detection Variables

These variables are set in the `determine-environment` job and passed to all subsequent jobs:

```yaml
# From outputs
- environment: production | staging | development
- env_name: Production | Staging | Development
- url: GitHub Pages URL for the environment
- is_production: true | false
- is_staging: true | false
- is_development: true | false
- debug_mode: true | false (enabled for dev/staging)
- analytics_enabled: true | false (enabled for staging/prod)
```

### Global Environment Variables

Set at workflow level:
```yaml
NODE_VERSION: '18'
PYTHON_VERSION: '3.11'
```

### Per-Job Environment Variables

Each job can access and use environment variables:

```yaml
env:
  ENV_NAME: ${{ needs.determine-environment.outputs.env_name }}
  DEBUG_MODE: ${{ needs.determine-environment.outputs.debug_mode }}
  ANALYTICS_ENABLED: ${{ needs.determine-environment.outputs.analytics_enabled }}
```

## Conditional Statements

### Step-Level Conditionals

Steps can run conditionally based on environment:

```yaml
# Only run in production
- name: "[PROD] Pre-deployment checks"
  if: needs.determine-environment.outputs.is_production == 'true'
  run: echo "Production deployment checks"

# Only run in non-production
- name: "[DEV] Quick deployment"
  if: needs.determine-environment.outputs.is_development == 'true'
  run: echo "Development deployment"

# Run in staging or production
- name: Run security scan
  if: needs.determine-environment.outputs.is_production == 'true' || needs.determine-environment.outputs.is_staging == 'true'
  run: echo "Security scan"
```

### Job-Level Conditionals

Entire jobs can be skipped for certain environments:

```yaml
security-scan:
  if: needs.determine-environment.outputs.is_production == 'true' || needs.determine-environment.outputs.is_staging == 'true'
  # This job only runs in production and staging
```

## Environment-Specific Configuration

### Development Environment
```
- Debug Mode: ON
- Analytics: OFF
- Cache: DISABLED
- API Timeout: 30s
- Test Level: Basic
- Notifications: Logs only
```

### Staging Environment
```
- Debug Mode: ON
- Analytics: ON
- Cache: ENABLED
- API Timeout: 15s
- Test Level: Complete
- Notifications: Full
- Security Scan: YES
```

### Production Environment
```
- Debug Mode: OFF
- Analytics: ON
- Cache: ENABLED
- API Timeout: 5s
- Test Level: Complete
- Notifications: Full
- Security Scan: YES
- Pre-deployment Checks: YES
```

## Generated Configuration File

The workflow generates `build/config.js` with environment-specific settings:

```javascript
const CONFIG = {
  environment: "production" | "staging" | "development",
  debugMode: true | false,
  analyticsEnabled: true | false,
  apiTimeout: 5000 | 15000 | 30000,
  cacheEnabled: true | false
};
```

## Conditional Features

### Production Optimizations
- Runs optimization checks
- Enables caching
- Reduces timeouts
- Full security scanning
- Pre-deployment validation

### Staging Testing
- Extended test suite
- Security scanning
- Performance benchmarks
- Debug mode enabled but optimized

### Development Workflow
- Fast build and deployment
- Verbose logging
- All debugging enabled
- Basic tests only
- Minimal notifications

## Using Conditional Variables in Steps

Example of using environment variables in commands:

```yaml
- name: Configure based on environment
  run: |
    if [[ "$DEBUG_MODE" == "true" ]]; then
      echo "Debug logging enabled"
    fi
    
    if [[ "$ANALYTICS_ENABLED" == "true" ]]; then
      echo "Analytics configured"
    fi
```

## Accessing Variables in Your Application

The generated `config.js` can be loaded in `index.html`:

```html
<script src="config.js"></script>
<script>
  // Use environment-specific configuration
  if (CONFIG.debugMode) {
    console.log("Running in debug mode");
  }
  
  fetch('/api/data', {
    timeout: CONFIG.apiTimeout
  });
</script>
```

## Adding More Environment-Specific Logic

To add new conditional logic:

1. Add new variable to `determine-environment` job outputs
2. Reference it in conditionals using `if:` statements
3. Use in steps with `${{ needs.determine-environment.outputs.variable_name }}`

Example:
```yaml
# In determine-environment job
echo "feature_flag_x=true" >> $GITHUB_OUTPUT  # for prod only

# In build job
- name: Enable Feature X
  if: needs.determine-environment.outputs.feature_flag_x == 'true'
  run: echo "Feature X enabled"
```

## Benefits

✅ **Automated Environment Selection**: No manual configuration needed
✅ **Conditional Execution**: Different steps run per environment
✅ **Dynamic Configuration**: Environment-specific settings generated automatically
✅ **Safety**: Production requires more checks than development
✅ **Efficiency**: Development deployments are faster
✅ **Traceability**: Full deployment reports for each environment
