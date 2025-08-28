import { auth } from './firebase';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithCredential,
  UserCredential,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';
import { SOCIAL_AUTH_CONFIG } from '@/config/socialAuthConfig';

// Google Sign-In
export const createGoogleAuthRequest = () => {
  return Google.useAuthRequest({
    clientId: SOCIAL_AUTH_CONFIG.GOOGLE.CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({
      scheme: SOCIAL_AUTH_CONFIG.APP.SCHEME,
    }),
  });
};

export const signInWithGoogleCredential = async (idToken: string): Promise<UserCredential> => {
  const credential = GoogleAuthProvider.credential(idToken);
  return await signInWithCredential(auth, credential);
};

// Facebook Sign-In
export const createFacebookAuthRequest = () => {
  return Facebook.useAuthRequest({
    clientId: SOCIAL_AUTH_CONFIG.FACEBOOK.APP_ID,
    scopes: ['public_profile', 'email'],
    redirectUri: makeRedirectUri({
      scheme: SOCIAL_AUTH_CONFIG.APP.SCHEME,
    }),
  });
};

export const signInWithFacebookCredential = async (accessToken: string): Promise<UserCredential> => {
  const credential = FacebookAuthProvider.credential(accessToken);
  return await signInWithCredential(auth, credential);
};

// Apple Sign-In
export const signInWithApple = async (): Promise<UserCredential> => {
  try {
    // Check if Apple Authentication is available
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple Sign-In is not available on this device');
    }

    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    const { identityToken } = appleCredential;
    if (!identityToken) {
      throw new Error('Apple Sign-In failed - no identity token');
    }

    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce,
    });

    return await signInWithCredential(auth, credential);
  } catch (error) {
    console.error('Apple Sign-In Error:', error);
    throw error;
  }
};

// Check if Apple Sign-In is available
export const isAppleSignInAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') return false;
  return await AppleAuthentication.isAvailableAsync();
};