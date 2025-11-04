#!/usr/bin/env node

/**
 * Script to add centralized API key to Supabase database
 * Run this script to manually add the API key to the database
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://oeghvmszrfomcmyhsnkh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZ2h2bXN6cmZvbWNteWhzbmtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE4Mjc3MywiZXhwIjoyMDc2NzU4NzczfQ.nihbxHdFhMjyzxMYpLCIh8g1wqObXLgT_p8nC8SsMp0";

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Centralized API key
const CENTRALIZED_API_KEY = 'org_1b25603d1e6199931316fc9e4be8adecd24a45bcbe19beea9e5cdd77e459be1b44814402c56533afae7b69';

async function addCentralizedAPIKey() {
  try {
    console.log('🔑 Adding centralized API key to database...');
    
    // Insert the centralized API key
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        key: 'centralized_ai_api_key',
        value: CENTRALIZED_API_KEY,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Error adding API key:', error);
      return false;
    }

    console.log('✅ Centralized API key added successfully');
    
    // Verify the key was added
    const { data: verification, error: verifyError } = await supabase
      .from('settings')
      .select('key, value, updated_at')
      .eq('key', 'centralized_ai_api_key')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying API key:', verifyError);
      return false;
    }

    console.log('🔍 Verification successful:');
    console.log(`   Key: ${verification.key}`);
    console.log(`   Value: ${verification.value.substring(0, 10)}...${verification.value.substring(verification.value.length - 10)}`);
    console.log(`   Updated: ${verification.updated_at}`);
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the script
addCentralizedAPIKey().then(success => {
  if (success) {
    console.log('\n🎉 Script completed successfully!');
    console.log('The centralized API key is now available for all users.');
  } else {
    console.log('\n💥 Script failed!');
    console.log('Please check the error messages above and try again.');
  }
  process.exit(success ? 0 : 1);
});