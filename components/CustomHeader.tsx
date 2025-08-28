import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface CustomHeaderProps {
  title?: string;
  showSearch?: boolean;
}

export default function CustomHeader({ title = 'TryJesus', showSearch = true }: CustomHeaderProps) {
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState('');
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter()

  return (
    <LinearGradient
      colors={['#FF9500', '#FF6B35']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#FF9500"
      />
      
      {/* Header Content - Search bar on left, profile on right */}
      <View style={styles.headerContent}>
        {/* Left side - Search Bar */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Ionicons
                name="search"
                size={20}
                color="rgba(255, 255, 255, 0.8)"
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: 'white' }]}
                placeholder="Search..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="rgba(255, 255, 255, 0.8)"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Right side - Bell and Profile Icons */}
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.notificationContainer}>
              <Ionicons
                name="notifications"
                size={24}
                color="white"
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=> router.push("/menu/menu")} style={styles.profileButton}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    marginRight: 8,
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E7',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
});