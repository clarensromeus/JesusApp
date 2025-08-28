import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileData {
  // Basic Profile Info
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  
  // Membership Details
  phoneNumber: string;
  matrimonialStatus: string;
  isSaved: boolean;
  actualChurch: string;
  pairMember: string;
  marriageDate: string;
  birthDay: string;
  status: string;
}

export default function EditProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets()
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Try',
    lastName: 'Jesus',
    email: 'tryjesus@gmail.com',
    country: '',
    city: '',
    phoneNumber: '',
    matrimonialStatus: 'Single',
    isSaved: false,
    actualChurch: '',
    pairMember: '',
    marriageDate: '',
    birthDay: '',
    status: 'Active',
  });

  const [showMarriageDatePicker, setShowMarriageDatePicker] = useState(false);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [marriageDate, setMarriageDate] = useState(new Date());
  const [birthday, setBirthday] = useState(new Date());

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload your profile picture!'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take your profile picture!'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to set your profile picture',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateField = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const handleMarriageDateChange = (event: any, selectedDate?: Date) => {
    setShowMarriageDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setMarriageDate(selectedDate);
      updateField('marriageDate', formatDate(selectedDate));
    }
  };

  const handleBirthdayChange = (event: any, selectedDate?: Date) => {
    setShowBirthdayPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthday(selectedDate);
      updateField('birthDay', formatDate(selectedDate));
    }
  };

  const handleSaveBasicInfo = async () => {
    setLoading(true);
    try {
      // Simulate API call for basic info
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Basic information updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update basic information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeMember = async () => {
    setLoading(true);
    try {
      // Simulate API call for membership
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Membership application submitted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit membership application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string,
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric',
    secureTextEntry?: boolean
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#999"
        keyboardType={keyboardType || 'default'}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );

  const renderPicker = (
    label: string,
    selectedValue: string,
    onValueChange: (value: string) => void,
    items: { label: string; value: string }[]
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );

  const renderDatePicker = (
    label: string,
    value: string,
    onPress: () => void
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={onPress}>
        <Text style={[styles.datePickerText, !value && styles.placeholderText]}>
          {value || 'Select date'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Image Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={showImageOptions}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Ionicons name="person" size={40} color="#fff" />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Basic Profile Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            {renderInput(
              'Email',
              profileData.email,
              (text) => updateField('email', text),
              'Enter your email',
              'email-address'
            )}
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput(
                  'First Name',
                  profileData.firstName,
                  (text) => updateField('firstName', text),
                  'First name'
                )}
              </View>
              <View style={styles.halfInput}>
                {renderInput(
                  'Last Name',
                  profileData.lastName,
                  (text) => updateField('lastName', text),
                  'Last name'
                )}
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput(
                  'Country',
                  profileData.country,
                  (text) => updateField('country', text),
                  'Your country'
                )}
              </View>
              <View style={styles.halfInput}>
                {renderInput(
                  'City',
                  profileData.city,
                  (text) => updateField('city', text),
                  'Your city'
                )}
              </View>
            </View>
            
            {/* Save Basic Info Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, loading && styles.actionButtonDisabled]}
              onPress={handleSaveBasicInfo}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Membership Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Membership Details</Text>
            
            {renderInput(
              'Phone Number',
              profileData.phoneNumber,
              (text) => updateField('phoneNumber', text),
              'Enter your phone number',
              'phone-pad'
            )}
            
            {renderPicker(
              'Matrimonial Status',
              profileData.matrimonialStatus,
              (value) => updateField('matrimonialStatus', value),
              [
                { label: 'Single', value: 'Single' },
                { label: 'Married', value: 'Married' },
                { label: 'Divorced', value: 'Divorced' },
                { label: 'Widowed', value: 'Widowed' },
              ]
            )}
            
            {renderInput(
              'Actual Church',
              profileData.actualChurch,
              (text) => updateField('actualChurch', text),
              'Your current church'
            )}
            
            {renderInput(
              'Pair Member',
              profileData.pairMember,
              (text) => updateField('pairMember', text),
              'Your pair member'
            )}
            
            <View >
              <View >
                {renderDatePicker(
                  'Marriage Date',
                  profileData.marriageDate,
                  () => setShowMarriageDatePicker(true)
                )}
              </View>
              <View>
                {renderDatePicker(
                  'Birthday',
                  profileData.birthDay,
                  () => setShowBirthdayPicker(true)
                )}
              </View>
            </View>
            
            {renderPicker(
              'Status',
              profileData.status,
              (value) => updateField('status', value),
              [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Pending', value: 'Pending' },
              ]
            )}
            
            {/* Is Saved Toggle */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Salvation Status</Text>
              <TouchableOpacity
                style={[styles.toggleButton, profileData.isSaved && styles.toggleButtonActive]}
                onPress={() => updateField('isSaved', !profileData.isSaved)}
              >
                <Text style={[styles.toggleText, profileData.isSaved && styles.toggleTextActive]}>
                  {profileData.isSaved ? 'Saved' : 'Not Saved'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Become Member Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.memberButton, loading && styles.actionButtonDisabled]}
              onPress={handleBecomeMember}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {loading ? 'Processing...' : 'Become a Member'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Marriage Date Picker */}
      {showMarriageDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showMarriageDatePicker}
          onRequestClose={() => setShowMarriageDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowMarriageDatePicker(false)}>
                  <Text style={styles.datePickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Marriage Date</Text>
                <TouchableOpacity onPress={() => setShowMarriageDatePicker(false)}>
                  <Text style={styles.datePickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={marriageDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleMarriageDateChange}
                maximumDate={new Date()}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Birthday Picker */}
      {showBirthdayPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showBirthdayPicker}
          onRequestClose={() => setShowBirthdayPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowBirthdayPicker(false)}>
                  <Text style={styles.datePickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Birthday</Text>
                <TouchableOpacity onPress={() => setShowBirthdayPicker(false)}>
                  <Text style={styles.datePickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={birthday}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleBirthdayChange}
                maximumDate={new Date()}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffa500',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  actionButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#FF8C00',
  },
  memberButton: {
    backgroundColor: '#FF8C00',
  },
  actionButtonDisabled: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  datePickerCancel: {
    fontSize: 16,
    color: '#666',
  },
  datePickerDone: {
    fontSize: 16,
    color: '#FF8C00',
    fontWeight: '600',
  },
});