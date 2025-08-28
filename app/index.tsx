import { useThemeColor } from '@/hooks/useThemeColor';
import {
  createFacebookAuthRequest,
  createGoogleAuthRequest,
  isAppleSignInAvailable,
  signInWithApple,
  signInWithFacebookCredential,
  signInWithGoogleCredential,
} from '@/utils/socialAuth';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { UserCredential } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

const loginSchema = z.object({
  emailOrPhone: z.string()
    .min(1, 'Email or phone number is required')
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[1-9][\d]{0,2}[\s]?[\(]?[\d]{1,3}[\)]?[\s]?[\d]{3,4}[\s]?[\d]{3,4}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }, 'Please enter a valid email address or phone number'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function WelcomeScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const router = useRouter();

  // Social Auth Requests
  const [googleRequest, googleResponse, googlePromptAsync] = createGoogleAuthRequest();
  const [facebookRequest, facebookResponse, facebookPromptAsync] = createFacebookAuthRequest();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  // Check Apple Sign-In availability
  useEffect(() => {
    const checkAppleAvailability = async () => {
      const available = await isAppleSignInAvailable();
      setAppleAvailable(available);
    };
    checkAppleAvailability();
  }, []);

  // Handle Google Sign-In Response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      if (id_token) {
        handleSocialSignIn('google', () => signInWithGoogleCredential(id_token));
      }
    }
  }, [googleResponse]);

  // Handle Facebook Sign-In Response
  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { access_token } = facebookResponse.params;
      if (access_token) {
        handleSocialSignIn('facebook', () => signInWithFacebookCredential(access_token));
      }
    }
  }, [facebookResponse]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Login data:', data);
      // Add your login logic here
      router.push("/(tabs)");
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Social Sign-In Handler
  const handleSocialSignIn = async (provider: string, signInFunction: () => Promise<UserCredential>) => {
    setSocialLoading(provider);
    try {
      const result = await signInFunction();
      if (result.user) {
        console.log(`${provider} sign-in successful:`, result.user.email);
        router.push("/(tabs)");
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      Alert.alert(
        'Sign-In Error',
        `Failed to sign in with ${provider}. Please try again.`,
        [{ text: 'OK' }]
      );
    } finally {
      setSocialLoading(null);
    }
  };

  // Social Login Button Handlers
  const handleGoogleSignIn = async () => {
    try {
      await googlePromptAsync();
    } catch (error) {
      console.error('Google sign-in prompt error:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await facebookPromptAsync();
    } catch (error) {
      console.error('Facebook sign-in prompt error:', error);
    }
  };

  const handleAppleSignIn = async () => {
    if (!appleAvailable) {
      Alert.alert('Not Available', 'Apple Sign-In is not available on this device.');
      return;
    }
    await handleSocialSignIn('apple', signInWithApple);
  };

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.welcomeTitle, { color: textColor }]}>
              Welcome !
            </Text>
            <Text style={[styles.subtitle, { color: '#666' }]}>
              To our Ministry of evangelization and spreading God's word
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email or Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: '#666' }]}>
                Email or Phone Number
              </Text>
              <Controller
                control={control}
                name="emailOrPhone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        color: textColor, 
                        borderColor: errors.emailOrPhone ? '#FF6B6B' : '#E5E5E5' 
                      }
                    ]}
                    placeholder="Enter your email or phone number"
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.emailOrPhone && (
                <Text style={styles.errorText}>{errors.emailOrPhone.message}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: '#666' }]}>
                Password
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[
                    styles.passwordContainer, 
                    { borderColor: errors.password ? '#FF6B6B' : '#E5E5E5' }
                  ]}>
                    <TextInput
                      style={[styles.passwordInput, { color: textColor }]}
                      placeholder="Enter password"
                      placeholderTextColor="#999"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <Controller
                control={control}
                name="rememberMe"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.rememberMeContainer}
                    onPress={() => onChange(!value)}
                  >
                    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                      {value && (
                        <Ionicons name="checkmark" size={12} color="white" />
                      )}
                    </View>
                    <Text style={[styles.rememberMeText, { color: '#666' }]}>
                      Remember me
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => router.push("/forgotPassword")} >
                <Text style={[styles.forgotPassword, { color: tintColor }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
              onPress={handleSubmit(onSubmit)} 
              style={[
                styles.signInButton, 
                { 
                  backgroundColor: isSubmitting ? '#CCC' : '#FF8C00',
                  opacity: isSubmitting ? 0.6 : 1
                }
              ]}
              disabled={isSubmitting}
            >
              <Text style={styles.signInButtonText}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, { color: '#999' }]}>Or sign in with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[
                  styles.socialButton,
                  { opacity: socialLoading === 'google' ? 0.6 : 1 }
                ]}
                onPress={handleGoogleSignIn}
                disabled={socialLoading !== null}
              >
                {socialLoading === 'google' ? (
                  <Text style={styles.loadingText}>...</Text>
                ) : (
                  <View style={styles.googleIcon}>
                    <Text style={styles.googleIconText}>G</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.socialButton, 
                  { 
                    backgroundColor: '#1877F2',
                    opacity: socialLoading === 'facebook' ? 0.6 : 1
                  }
                ]}
                onPress={handleFacebookSignIn}
                disabled={socialLoading !== null}
              >
                {socialLoading === 'facebook' ? (
                  <Text style={styles.loadingText}>...</Text>
                ) : (
                  <Ionicons name="logo-facebook" size={24} color="white" />
                )}
              </TouchableOpacity>
              
              {appleAvailable && (
                <TouchableOpacity 
                  style={[
                    styles.socialButton, 
                    { 
                      backgroundColor: '#000',
                      opacity: socialLoading === 'apple' ? 0.6 : 1
                    }
                  ]}
                  onPress={handleAppleSignIn}
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'apple' ? (
                    <Text style={styles.loadingText}>...</Text>
                  ) : (
                    <Ionicons name="logo-apple" size={24} color="white" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: '#666' }]}>
                Not Registered Yet?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={[styles.signUpLink, { color: '#FF8C00' }]}>
                  Sign up Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 3,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  rememberMeText: {
    fontSize: 14,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#FF8C00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});