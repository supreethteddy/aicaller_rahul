# Centralized API Key Management

This document explains how the centralized API key system works in the AI Caller application.

## Overview

The application uses a centralized API key system where all users share a single API key for AI calling services. This eliminates the need for individual users to configure their own API keys and provides better control and management.

## API Key Details

- **Key Name**: `centralized_ai_api_key`
- **Value**: `org_1b25603d1e6199931316fc9e4be8adecd24a45bcbe19beea9e5cdd77e459be1b44814402c56533afae7b69`
- **Location**: Stored in Supabase `settings` table
- **Access**: All authenticated users can use this key for AI calling

## Database Setup

The centralized API key is automatically added to the database when the admin panel loads for the first time. You can also manually add it using:

### Option 1: Automatic Setup
The API key is automatically configured when an admin visits the admin dashboard settings page.

### Option 2: Manual Script
Run the provided script to add the API key:

```bash
node scripts/add-centralized-api-key.js
```

### Option 3: SQL Migration
Run the SQL migration file:

```sql
-- Run this in your Supabase SQL editor
\i supabase/migrations/001_add_centralized_api_key.sql
```

## Admin Management

Super admins can manage the centralized API key through the admin dashboard:

1. Navigate to `/admin`
2. Go to the "Settings" tab
3. Use the "Centralized API Management" section to:
   - View current API key status
   - Test the connection
   - Update the API key if needed

## User Experience

For regular users:
- No API key configuration required
- Can immediately create campaigns and make calls
- All AI calling features work out of the box
- No third-party branding visible

## Security Considerations

- The API key is stored securely in the database
- Only super admins can modify the centralized key
- All API calls are made server-side using the centralized key
- Users never see or handle the actual API key

## Troubleshooting

### API Key Not Working
1. Check if the key exists in the database:
   ```sql
   SELECT * FROM settings WHERE key = 'centralized_ai_api_key';
   ```

2. Test the connection in the admin panel

3. Verify the API key is valid with the service provider

### Users Can't Make Calls
1. Ensure the centralized API key is configured
2. Check the admin panel for connection status
3. Verify user activation status

## Files Modified

- `src/integrations/bland-ai/client.ts` - Updated to use centralized key
- `src/services/blandAIService.ts` - Updated to use centralized key
- `src/components/admin/CentralizedAPIManagement.tsx` - Admin management interface
- `src/components/bland-ai/BlandAISettings.tsx` - Removed user API key configuration
- `src/components/bland-ai/VoicesPage.tsx` - Removed API key requirements

## Migration Notes

If upgrading from individual API keys:
1. The system will automatically migrate to the centralized approach
2. Individual user API keys are no longer used
3. All users will use the centralized key automatically
4. No user action required for the migration
