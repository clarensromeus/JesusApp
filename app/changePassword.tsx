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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters')
    .max(50, 'New password must be less than 50 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordScreen() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const insets = useSafeAreaInsets()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      console.log('Change password data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert(
        'Error',
        'Failed to change password. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor, paddingBottom: insets.bottom }]}>
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
          <View style={styles.headerContainer}>
          </View>

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
                Change Password
              </Text>
              <Text style={[styles.subtitle, { color: '#666' }]}>
                Enter your current password and choose a new secure password
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Current Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>
                  Current Password
                </Text>
                <Controller
                  control={control}
                  name="currentPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[
                      styles.passwordContainer, 
                      { borderColor: errors.currentPassword ? '#FF6B6B' : '#E5E5E5' }
                    ]}>
                      <TextInput
                        style={[styles.passwordInput, { color: textColor }]}
                        placeholder="Enter your current password"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showCurrentPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showCurrentPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#999"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword.message}</Text>
                )}
              </View>

              {/* New Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>
                  New Password
                </Text>
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[
                      styles.passwordContainer, 
                      { borderColor: errors.newPassword ? '#FF6B6B' : '#E5E5E5' }
                    ]}>
                      <TextInput
                        style={[styles.passwordInput, { color: textColor }]}
                        placeholder="Enter your new password"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showNewPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showNewPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#999"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword.message}</Text>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: '#666' }]}>
                  Confirm New Password
                </Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[
                      styles.passwordContainer, 
                      { borderColor: errors.confirmPassword ? '#FF6B6B' : '#E5E5E5' }
                    ]}>
                      <TextInput
                        style={[styles.passwordInput, { color: textColor }]}
                        placeholder="Confirm your new password"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#999"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={[styles.requirementsTitle, { color: '#666' }]}>
                  Password Requirements:
                </Text>
                <Text style={[styles.requirementText, { color: '#666' }]}>
                  • At least 6 characters long
                </Text>
                <Text style={[styles.requirementText, { color: '#666' }]}>
                  • Contains uppercase and lowercase letters
                </Text>
                <Text style={[styles.requirementText, { color: '#666' }]}>
                  • Contains at least one number
                </Text>
              </View>

              {/* Change Password Button */}
              <TouchableOpacity 
                onPress={handleSubmit(onSubmit)} 
                style={[
                  styles.changeButton, 
                  { 
                    backgroundColor: isSubmitting ? '#CCC' : '#FF8C00',
                    opacity: isSubmitting ? 0.6 : 1
                  }
                ]}
                disabled={isSubmitting}
              >
                <Text style={styles.changeButtonText}>
                  {isSubmitting ? 'Changing Password...' : 'Change Password'}
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
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  requirementsContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 2,
  },
  changeButton: {
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
  changeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});