import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const currentDate = new Date();
  const greeting = currentDate.getHours() < 12 ? 'Good Morning' : currentDate.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';
  
  const quickActions = [
    { id: 1, title: 'Daily Devotion', icon: 'book-outline', color: '#FF9500', route: 'devotion' },
    { id: 2, title: 'Prayer Request', icon: 'heart-outline', color: '#FF7A00', route: 'prayer' },
    { id: 3, title: 'Give & Tithe', icon: 'gift-outline', color: '#FF6B35', route: 'give' },
    { id: 4, title: 'Events', icon: 'calendar-outline', color: '#FF8C42', route: 'event' },
  ];

  const featuredContent = [
    {
      id: 1,
      title: 'Unlock Your Faith',
      subtitle: 'Daily Devotional',
      description: 'Start your day with God\'s word',
      gradient: ['#FF9500', '#FF6B35'] as const,
      icon: 'book-outline'
    },
    {
      id: 2,
      title: 'Jesus Loves You',
      subtitle: 'Weekly Message',
      description: 'Experience His unconditional love',
      gradient: ['#FF7A00', '#FF5722'] as const,
      icon: 'heart-outline'
    },
    {
      id: 3,
      title: 'Prayer Warriors',
      subtitle: 'Community',
      description: 'Join our prayer community',
      gradient: ['#FF8C42', '#FF6B35'] as const,
      icon: 'people-outline'
    },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Sunday Service', time: '10:00 AM', date: 'Today', type: 'worship' },
    { id: 2, title: 'Bible Study', time: '7:00 PM', date: 'Wednesday', type: 'study' },
    { id: 3, title: 'Youth Meeting', time: '6:00 PM', date: 'Friday', type: 'youth' },
  ];

  const podcastVideos = [
    {
      id: 1,
      title: 'Walking in Faith',
      speaker: 'Pastor John',
      duration: '12:45',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      views: '2.1K',
      category: 'Devotional'
    },
    {
      id: 2,
      title: 'God\'s Love Never Fails',
      speaker: 'Pastor Sarah',
      duration: '18:30',
      thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
      views: '5.3K',
      category: 'Worship'
    },
    {
      id: 3,
      title: 'Finding Peace in Prayer',
      speaker: 'Pastor Michael',
      duration: '15:20',
      thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop',
      views: '3.7K',
      category: 'Prayer'
    },
    {
      id: 4,
      title: 'Youth & Purpose',
      speaker: 'Pastor David',
      duration: '22:15',
      thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=200&fit=crop',
      views: '4.2K',
      category: 'Youth'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <LinearGradient
           colors={['#FF9500', '#FF6B35'] as const}
           style={styles.headerGradient}
           start={{ x: 0, y: 0 }}
           end={{ x: 1, y: 1 }}
         >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greetingText}>{greeting}</Text>
                <Text style={styles.welcomeText}>Welcome to TryJesus</Text>
              </View>
            </View>
            
            <View style={styles.verseContainer}>
              <Ionicons name="book" size={20} color="rgba(255,255,255,0.8)" />
              <Text style={styles.verseText}>
                "For I know the plans I have for you," declares the Lord
              </Text>
              <Text style={styles.verseReference}>- Jeremiah 29:11</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Go Faster With</ThemedText>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={[styles.quickActionText, { color: textColor }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Content */}
        <View style={styles.featuredContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Potential Features</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {featuredContent.map((item) => (
              <TouchableOpacity key={item.id} style={styles.featuredCard}>
                <LinearGradient
                  colors={item.gradient}
                  style={styles.featuredGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.featuredContent}>
                    <Ionicons name={item.icon as any} size={32} color="white" style={styles.featuredIcon} />
                    <Text style={styles.featuredTitle}>{item.title}</Text>
                    <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
                    <Text style={styles.featuredDescription}>{item.description}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventsContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Upcoming Events</ThemedText>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: tintColor }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <View style={styles.eventLeft}>
                <View style={[styles.eventTypeIndicator, { backgroundColor: getEventColor(event.type) }]} />
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventTitle, { color: textColor }]}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time} • {event.date}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Podcast Videos */}
        <View style={styles.podcastContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Latest Podcasts</ThemedText>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: tintColor, marginRight: 22 }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.podcastScroll}
            contentContainerStyle={styles.podcastScrollContent}
          >
            {podcastVideos.map((video) => (
              <TouchableOpacity key={video.id} style={styles.podcastCard}>
                <View style={styles.thumbnailContainer}>
                  <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={20} color="white" />
                  </View>
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{video.duration}</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{video.category}</Text>
                  </View>
                </View>
                <View style={styles.podcastInfo}>
                  <Text style={[styles.podcastTitle, { color: textColor }]} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <Text style={styles.speakerName}>{video.speaker}</Text>
                  <View style={styles.podcastMeta}>
                    <Ionicons name="eye-outline" size={12} color="#999" />
                    <Text style={styles.viewsText}>{video.views} views</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getEventColor(type: string) {
  switch (type) {
    case 'worship': return '#FF9500';
    case 'study': return '#FF7A00';
    case 'youth': return '#FF6B35';
    default: return '#FF8C42';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerGradient: {
    // paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9500',
  },
  verseContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    // marginTop: 10,
  },
  verseText: {
    fontSize: 16,
    color: 'white',
    fontStyle: 'italic',
    lineHeight: 24,
    marginVertical: 8,
  },
  verseReference: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
    fontWeight: '500',
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuredContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  featuredScroll: {
    paddingRight: 20,
  },
  featuredCard: {
    width: 280,
    height: 160,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  featuredContent: {
    flex: 1,
  },
  featuredIcon: {
    marginBottom: 12,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 16,
  },
  eventsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  podcastContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  podcastScroll: {
    paddingRight: 20,
  },
  podcastScrollContent: {
    paddingRight: 20,
    paddingBottom: 6
  },
  podcastCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 160,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  podcastInfo: {
    padding: 16,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 22,
  },
  speakerName: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
    marginBottom: 8,
  },
  podcastMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});
