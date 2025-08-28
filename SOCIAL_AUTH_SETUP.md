# Social Authentication Setup Guide

This guide will help you configure Google, Facebook, and Apple authentication for your TryJesus app.

## Prerequisites

- Expo CLI installed
- Firebase project set up
- Apple Developer account (for Apple Sign-In)
- Google Developer account
- Facebook Developer account

## 1. Firebase Configuration

Make sure your Firebase project has Authentication enabled:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Authentication > Sign-in method
4. Enable Google, Facebook, and Apple providers

## 2. Google Sign-In Setup

### Step 1: Create OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to APIs & Services > Credentials
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure for each platform:

#### For iOS:
- Application type: iOS
- Bundle ID: Your app's bundle identifier

#### For Android:
- Application type: Android
- Package name: Your app's package name
- SHA-1 certificate fingerprint: Get from `expo credentials:manager`

#### For Web (Expo Go):
- Application type: Web application
- Authorized redirect URIs: `https://auth.expo.io/@your-username/your-app-slug`

### Step 2: Configure Firebase
1. In Firebase Console > Authentication > Sign-in method
2. Enable Google provider
3. Add your Web client ID from Google Cloud Console

### Step 3: Update Configuration
Update `config/socialAuthConfig.ts`:
```typescript
GOOGLE: {
  CLIENT_ID: 'your-actual-google-client-id.googleusercontent.com',
},
```

## 3. Facebook Sign-In Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   - For Expo Go: `https://auth.expo.io/@your-username/your-app-slug`
   - For standalone app: `fb{app-id}://authorize`

### Step 2: Configure Firebase
1. In Firebase Console > Authentication > Sign-in method
2. Enable Facebook provider
3. Add your App ID and App Secret from Facebook

### Step 3: Update Configuration
Update `config/socialAuthConfig.ts`:
```typescript
FACEBOOK: {
  APP_ID: 'your-facebook-app-id',
},
```

## 4. Apple Sign-In Setup

### Step 1: Enable in Apple Developer Console
1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Navigate to Certificates, Identifiers & Profiles
3. Select your App ID
4. Enable "Sign In with Apple" capability

### Step 2: Configure Firebase
1. In Firebase Console > Authentication > Sign-in method
2. Enable Apple provider
3. Configure Service ID and Team ID

### Step 3: Update app.json
Add to your `app.json`:
```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.developer.applesignin": ["Default"]
      }
    }
  }
}
```

## 5. App Configuration

### Update app.json
Add your custom URL scheme:
```json
{
  "expo": {
    "scheme": "tryjesus",
    "ios": {
      "bundleIdentifier": "com.yourcompany.tryjesus"
    },
    "android": {
      "package": "com.yourcompany.tryjesus"
    }
  }
}
```

### Update Configuration
Update `config/socialAuthConfig.ts`:
```typescript
APP: {
  SCHEME: 'tryjesus', // Match your app.json scheme
},
```

## 6. Testing

### Development
- Use Expo Go for testing during development
- Social auth will redirect through Expo's auth proxy

### Production
- Build standalone app for full social auth functionality
- Test on physical devices

## 7. Troubleshooting

### Common Issues

1. **"Invalid client" error**
   - Check that your OAuth client ID is correct
   - Ensure bundle ID/package name matches

2. **"Redirect URI mismatch"**
   - Verify redirect URIs in provider console
   - Check app scheme configuration

3. **Apple Sign-In not available**
   - Only works on iOS 13+ devices
   - Requires proper entitlements

4. **Facebook login fails**
   - Check App ID configuration
   - Verify OAuth redirect URIs

### Debug Tips

1. Check console logs for detailed error messages
2. Verify Firebase Authentication is properly configured
3. Test with different devices and OS versions
4. Use Firebase Auth emulator for local testing

## Security Notes

- Never commit actual credentials to version control
- Use environment variables for sensitive data in production
- Regularly rotate OAuth secrets
- Monitor authentication logs for suspicious activity

## Support

For additional help:
- [Expo Auth Session Documentation](https://docs.expo.dev/guides/authentication/)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Apple Sign-In Documentation](https://developer.apple.com/sign-in-with-apple/)