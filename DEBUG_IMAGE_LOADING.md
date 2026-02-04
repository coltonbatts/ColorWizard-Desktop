# Debugging Image Loading Issue

## Symptoms
- Blue question mark boxes appear instead of images
- UUID displayed instead of filename
- Images fail to load

## Quick Fixes Applied

1. **Added error handling** - Images now log errors to console
2. **Path normalization** - Handles both `/` and `\` separators  
3. **Better fallbacks** - Shows path info when image fails

## To Debug

1. **Open DevTools** (right-click → Inspect Element)
2. **Check Console** for errors like:
   - "Failed to convert file src"
   - "Failed to load reference image"
3. **Check Network tab** - Look for failed image requests
4. **Verify file exists**:
   ```bash
   ls -la ~/Documents/ColorWizard/*/reference/
   ```

## Common Issues

### Issue 1: File doesn't exist
**Check:** Does the file exist at the expected path?
```bash
# Find your project
find ~/Documents/ColorWizard -name "project.json" -exec dirname {} \;

# Check reference folder
ls -la <project-path>/reference/
```

### Issue 2: Path format wrong
**Check:** Is the path in `project.json` correct?
- Should be: `reference/reference-1234567890.png`
- Not: `reference\reference-1234567890.png` (Windows backslash)

### Issue 3: UUID instead of name
**Cause:** Old reference format or migration issue
**Fix:** The reference might need to be re-imported

## Next Steps

1. Check browser console for specific errors
2. Verify the file exists on disk
3. Check `project.json` structure
4. Try re-importing the image
