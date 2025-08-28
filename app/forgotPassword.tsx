import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      console.log('Reset password for:', data.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      
      Alert.alert(
        'Email Sent!',
        `We've sent a password reset link to ${data.email}. Please check your inbox and follow the instructions to reset your password.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally navigate back to login
              // router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(
        'Error',
        'Failed to send reset email. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first.');
      return;
    }
    
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Email Resent!',
        `We've sent another password reset link to ${email}.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to resend email. Please try again.');
    }
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
          {/* Main Content */}
          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: '#FF8C00' }]}>
                <Ionicons name="lock-closed" size={32} color="white" />
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: textColor }]}>
                Forgot Password?
              </Text>
              <Text style={[styles.subtitle, { color: '#666' }]}>
                {isEmailSent 
                  ? "We've sent you a password reset link"
                  : "Don't worry! Enter your email address and we'll send you a link to reset your password."
                }
              </Text>
            </View>

            {/* Form */}
            {!isEmailSent ? (
              <View style={styles.form}>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: '#666' }]}>
                    Email Address
                  </Text>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputWrapper}>
                        <Ionicons 
                          name="mail-outline" 
                          size={20} 
                          color="#999" 
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[
                            styles.input,
                            { 
                              color: textColor, 
                              borderColor: errors.email ? '#FF6B6B' : '#E5E5E5' 
                            }
                          ]}
                          placeholder="Enter your email address"
                          placeholderTextColor="#999"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    )}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </View>

                {/* Send Reset Link Button */}
                <TouchableOpacity 
                  onPress={handleSubmit(onSubmit)} 
                  style={[
                    styles.resetButton, 
                    { 
                      backgroundColor: isSubmitting ? '#CCC' : '#FF8C00',
                      opacity: isSubmitting ? 0.6 : 1
                    }
                  ]}
                  disabled={isSubmitting}
                >
                  <Text style={styles.resetButtonText}>
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.successContainer}>
                {/* Success Icon */}
                <View style={styles.successIconContainer}>
                  <View style={[styles.successIcon, { backgroundColor: '#4CAF50' }]}>
                    <Ionicons name="checkmark" size={24} color="white" />
                  </View>
                </View>

                {/* Success Message */}
                <Text style={[styles.successTitle, { color: textColor }]}>
                  Check Your Email
                </Text>
                <Text style={[styles.successSubtitle, { color: '#666' }]}>
                  We've sent a password reset link to your email address. 
                  Click the link in the email to reset your password.
                </Text>

                {/* Resend Button */}
                <TouchableOpacity 
                  onPress={handleResendEmail}
                  style={styles.resendButton}
                >
                  <Text style={[styles.resendButtonText, { color: '#FF8C00' }]}>
                    Didn't receive the email? Resend
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Back to Sign In */}
            <View style={styles.backToSignInContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <View style={styles.backToSignInButton}>
                  <Ionicons name="arrow-back" size={16} color="#666" />
                  <Text style={[styles.backToSignInText, { color: '#666' }]}>
                    Back to Sign In
                  </Text>
                </View>
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
  },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  resetButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  backToSignInContainer: {
    alignItems: 'center',
  },
  backToSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backToSignInText: {
    fontSize: 14,
    marginLeft: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});