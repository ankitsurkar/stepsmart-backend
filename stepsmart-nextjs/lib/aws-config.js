// This file is safe to commit — it contains no secrets.
// Cognito uses PKCE (public client mode); there is no client secret.
const awsConfig = {
  Auth: {
    Cognito: {
      region: 'eu-north-1',
      userPoolId: 'eu-north-1_jnwEn55p2',
      userPoolClientId: '4hjlo8ssb3p17dr4bnk19cmgqk',
      loginWith: {
        oauth: {
          domain: 'stepsmart-learn.auth.eu-north-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [
            'http://localhost:3000/dashboard',
            'https://stepsmart.net/dashboard'
          ],
          redirectSignOut: [
            'http://localhost:3000/login',
            'https://stepsmart.net/login'
          ],
          responseType: 'code'
        }
      }
    },
  },
};

export default awsConfig;
