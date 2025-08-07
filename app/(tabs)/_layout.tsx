import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import CustomHeader from '@/components/CustomHeader';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        header: () => <CustomHeader />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          header: () => <CustomHeader title="Home" />,
        }}
      />
      <Tabs.Screen
        name="devotion"
        options={{
          title: 'Devotion',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
          header: () => <CustomHeader title="Devotion" />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: 'Prayer',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
          header: () => <CustomHeader title="Prayer" />,
        }}
      />
      <Tabs.Screen
        name="give"
        options={{
          title: 'Give',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gift.fill" color={color} />,
          header: () => <CustomHeader title="Give" />,
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
          header: () => <CustomHeader title="Events" />,
        }}
      />
    </Tabs>
  );
}
