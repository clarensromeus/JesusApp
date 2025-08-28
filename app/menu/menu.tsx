import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function MenuScreen() {
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName] = useState('Try Jesus');
  const insets = useSafeAreaInsets()
  const router = useRouter()



  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: t('menu.editProfile'),
      icon: 'person-outline',
      onPress: () => {
        // Navigate to edit profile
        router.push("/profile/edit")
      },
    },
    {
      id: '2',
      title: t('menu.myPrayer'),
      icon: 'heart-outline',
      onPress: () => {
        router.push('/(tabs)/prayer');
      },
    },
    {
      id: '3',
      title: t('menu.myDevo'),
      icon: 'book-outline',
      onPress: () => {
        router.push('/(tabs)/devotion');
      },
    },
    {
      id: '4',
      title: t('menu.testimonies'),
      icon: 'heart-circle-outline',
      onPress: () => {
        router.push('/testimony/testimony');
      },
    },
    {
      id: '5',
      title: t('menu.recentViewed'),
      icon: 'time-outline',
      onPress: () => {
        console.log('Recent Viewed pressed');
      },
    },
    {
      id: '6',
      title: t('menu.settings'),
      icon: 'settings-outline',
      onPress: () => {
        router.push("/settings/settings")
      },
    },
    {
      id: '7',
      title: t('menu.changePassword'),
      icon: 'lock-closed-outline',
      onPress: () => {
        router.push('/changePassword');
      },
    },
    {
      id: '8',
      title: t('menu.logout'),
      icon: 'log-out-outline',
      onPress: () => {
        Alert.alert(
          t('menu.logout'),
          'Are you sure you want to logout?',
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('menu.logout'),
              style: 'destructive',
              onPress: () => {
                router.replace('/');
              },
            },
          ]
        );
      },
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={22} color="#666" />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('menu.profile')}</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
          </View>
          
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    
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
  settingsButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
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

  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});