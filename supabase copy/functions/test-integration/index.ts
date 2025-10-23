import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { sourceType, credentials } = await req.json();
    console.log(`Testing connection for ${sourceType}`);
    let testResult = {
      success: false,
      message: 'Unknown source type'
    };
    switch(sourceType){
      case 'facebook':
        testResult = await testFacebookConnection(credentials);
        break;
      case 'linkedin':
        testResult = await testLinkedInConnection(credentials);
        break;
      case 'google_sheets':
        testResult = await testGoogleSheetsConnection(credentials);
        break;
      case 'typeform':
        testResult = await testTypeformConnection(credentials);
        break;
      case 'elevenlabs':
      case 'bland_ai':
        testResult = await testElevenLabsConnection(credentials);
        break;
    }
    return new Response(JSON.stringify(testResult), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: testResult.success ? 200 : 400
    });
  } catch (error) {
    console.error('Error testing integration:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
async function testFacebookConnection(credentials) {
  try {
    const { appId, appSecret, accessToken, adAccountId } = credentials;
    // Test Graph API access
    const response = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}?access_token=${accessToken}&fields=name,account_status`);
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: `Facebook API error: ${error.error?.message || 'Invalid credentials'}`
      };
    }
    const data = await response.json();
    return {
      success: true,
      message: `Connected to ad account: ${data.name}`,
      accountInfo: data
    };
  } catch (error) {
    return {
      success: false,
      message: `Facebook connection failed: ${error.message}`
    };
  }
}
async function testLinkedInConnection(credentials) {
  try {
    const { accessToken } = credentials;
    // Test LinkedIn API access
    const response = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: `LinkedIn API error: ${error.message || 'Invalid access token'}`
      };
    }
    const data = await response.json();
    return {
      success: true,
      message: `Connected to LinkedIn account`,
      accountInfo: data
    };
  } catch (error) {
    return {
      success: false,
      message: `LinkedIn connection failed: ${error.message}`
    };
  }
}
async function testGoogleSheetsConnection(credentials) {
  try {
    const { serviceAccountJson, spreadsheetId } = credentials;
    // Create JWT for Google API authentication
    const jwt = await createGoogleJWT(serviceAccountJson);
    // Test Google Sheets API access
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: `Google Sheets API error: ${error.error?.message || 'Invalid credentials'}`
      };
    }
    const data = await response.json();
    return {
      success: true,
      message: `Connected to spreadsheet: ${data.properties?.title}`,
      sheetInfo: data.properties
    };
  } catch (error) {
    return {
      success: false,
      message: `Google Sheets connection failed: ${error.message}`
    };
  }
}
async function testTypeformConnection(credentials) {
  try {
    const { accessToken, formId } = credentials;
    // Test Typeform API access
    const response = await fetch(`https://api.typeform.com/forms/${formId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: `Typeform API error: ${error.description || 'Invalid credentials'}`
      };
    }
    const data = await response.json();
    return {
      success: true,
      message: `Connected to form: ${data.title}`,
      formInfo: data
    };
  } catch (error) {
    return {
      success: false,
      message: `Typeform connection failed: ${error.message}`
    };
  }
}
async function testElevenLabsConnection(credentials) {
  try {
    const { api_key } = credentials;
    
    if (!api_key) {
      return {
        success: false,
        message: 'ElevenLabs API key is required'
      };
    }

    // Test the API key by getting user info from ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      method: 'GET',
      headers: {
        'xi-api-key': api_key,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.detail?.message || 'Invalid ElevenLabs API key'
      };
    }

    const userData = await response.json();
    
    // Also test voices endpoint to ensure full access
    const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': api_key,
        'Content-Type': 'application/json'
      }
    });

    if (!voicesResponse.ok) {
      return {
        success: false,
        message: 'Unable to access voices - API key may have limited permissions'
      };
    }

    const voicesData = await voicesResponse.json();
    
    return {
      success: true,
      message: 'ElevenLabs connection successful',
      data: {
        user_id: userData.xi_api_key_id || 'unknown',
        subscription_tier: userData.subscription?.tier || 'unknown',
        character_count: userData.subscription?.character_count || 0,
        character_limit: userData.subscription?.character_limit || 0,
        voices_available: voicesData.voices?.length || 0
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `ElevenLabs connection failed: ${error.message}`
    };
  }
}

async function createGoogleJWT(serviceAccount) {
  // This is a simplified JWT creation for Google API
  // In production, you'd use a proper JWT library
  const header = btoa(JSON.stringify({
    alg: 'RS256',
    typ: 'JWT'
  }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }));
  // Note: This is a placeholder. In a real implementation,
  // you'd need to properly sign the JWT with the private key
  return 'mock_jwt_token';
}
