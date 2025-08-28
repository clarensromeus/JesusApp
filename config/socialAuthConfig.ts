// Social Authentication Configuration
// Replace these placeholder values with your actual credentials

export const SOCIAL_AUTH_CONFIG = {
  // Google OAuth Configuration
  // Get these from: https://console.developers.google.com/
  GOOGLE: {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google OAuth Client ID
    // For iOS: 'your-app-id.googleusercontent.com'
    // For Android: 'your-app-id.googleusercontent.com'
    // For Web: 'your-app-id.googleusercontent.com'
  },

  // Facebook OAuth Configuration
  // Get these from: https://developers.facebook.com/
  FACEBOOK: {
    APP_ID: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
  },

  // App Configuration
  APP: {
    SCHEME: 'tryjesus', // Replace with your app's custom URL scheme
  },
};

// Instructions for setup:
// 
// 1. GOOGLE SETUP:
//    - Go to https://console.developers.google.com/
//    - Create a new project or select existing
//    - Enable Google+ API
//    - Create OAuth 2.0 credentials
//    - Add your bundle ID for iOS and package name for Android
//    - Copy the Client ID and replace GOOGLE.CLIENT_ID above
//
// 2. FACEBOOK SETUP:
//    - Go to https://developers.facebook.com/
//    - Create a new app or select existing
//    - Add Facebook Login product
//    - Configure OAuth redirect URIs
//    - Copy the App ID and replace FACEBOOK.APP_ID above
//
// 3. APPLE SETUP:
//    - Apple Sign-In works automatically with Expo
//    - Make sure your app is configured in Apple Developer Console
//    - Enable Sign In with Apple capability
//
// 4. APP SCHEME SETUP:
//    - Update app.json with your custom scheme
//    - Replace APP.SCHEME above with your actual scheme