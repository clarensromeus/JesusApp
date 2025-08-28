import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signUpSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  agreeToTerms: z.boolean()
    .refine((value) => value === true, 'You must agree to the terms and conditions'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
  });

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log('Sign up data:', data);
      // Add your sign up logic here
      router.push("/(tabs)");
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const handleSignInNavigation = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor, marginBottom: insets.bottom }]}>
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
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: '#666' }]}>
              Join our Ministry and be part of God's mission
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* First Name Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: '#666' }]}>
                First Name
              </Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        color: textColor, 
                        borderColor: errors.firstName ? '#FF6B6B' : '#E5E5E5' 
                      }
                    ]}
                    placeholder="Enter your first name"
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName.message}</Text>
              )}
            </View>

            {/* Last Name Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: '#666' }]}>
                Last Name
              </Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        color: textColor, 
                        borderColor: errors.lastName ? '#FF6B6B' : '#E5E5E5' 
                      }
                    ]}
                    placeholder="Enter your last name"
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName.message}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: '#666' }]}>
                Email Address
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
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
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
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
                      placeholder="Create a strong password"
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

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Controller
                control={control}
                name="agreeToTerms"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => onChange(!value)}
                  >
                    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                      {value && (
                        <Ionicons name="checkmark" size={12} color="white" />
                      )}
                    </View>
                    <Text style={[styles.termsText, { color: '#666' }]}>
                      I agree to the{' '}
                      <Text style={[styles.termsLink, { color: '#FF8C00' }]}>
                        Terms of Service
                      </Text>
                      {' '}and{' '}
                      <Text style={[styles.termsLink, { color: '#FF8C00' }]}>
                        Privacy Policy
                      </Text>
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {errors.agreeToTerms && (
                <Text style={styles.errorText}>{errors.agreeToTerms.message}</Text>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              onPress={handleSubmit(onSubmit)} 
              style={[
                styles.signUpButton, 
                { 
                  backgroundColor: isSubmitting ? '#CCC' : '#FF8C00',
                  opacity: isSubmitting ? 0.6 : 1
                }
              ]}
              disabled={isSubmitting}
            >
              <Text style={styles.signUpButtonText}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[styles.signInText, { color: '#666' }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleSignInNavigation}>
                <Text style={[styles.signInLink, { color: '#FF8C00' }]}>
                  Sign In
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: -10,
    left: -8,
    padding: 8,
    zIndex: 1,
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
  termsContainer: {
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 3,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    fontWeight: '600',
  },
  signUpButton: {
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
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});