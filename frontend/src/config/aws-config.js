// Fill in your values from Step 3 and Step 8 of the deployment guide.
// User Pool ID:       AWS Console → Cognito → your pool → "User pool ID"
// App Client ID:      AWS Console → Cognito → your pool → App clients → Client ID
//
// This file is safe to commit — it contains no secrets.
// Cognito uses PKCE (public client mode); there is no client secret.
const awsConfig = {
  Auth: {
    Cognito: {
      region: 'eu-north-1',      
      userPoolId: 'eu-north-1_jnwEn55p2',        // ← replace after Step 3
      userPoolClientId: '4hjlo8ssb3p17dr4bnk19cmgqk',    // ← replace after Step 3
    },
  },
};

export default awsConfig;
