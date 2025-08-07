import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: 'worship' | 'youth' | 'community' | 'special' | 'retreat';
  attendees: number;
  maxAttendees?: number;
  isRegistered: boolean;
  isFeatured: boolean;
}

interface EventCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function EventScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  const categories: EventCategory[] = [
    { id: 'all', name: 'Tous', icon: 'grid', color: '#FF9500' },
    { id: 'worship', name: 'Culte', icon: 'musical-notes', color: '#FF6B35' },
    { id: 'youth', name: 'Jeunes', icon: 'people', color: '#FF8C42' },
    { id: 'community', name: 'Communauté', icon: 'heart', color: '#FFB366' },
    { id: 'special', name: 'Spécial', icon: 'star', color: '#FF9500' },
    { id: 'retreat', name: 'Retraite', icon: 'leaf', color: '#FF6B35' },
  ];
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const featuredEvents = events.filter(event => event.isFeatured);
  
  const toggleRegistration = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: !event.isRegistered }
        : event
    ));
  };
  
  const renderCategoryFilter = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollView}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && {
                backgroundColor: category.color,
              }
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={16} 
              color={selectedCategory === category.id ? 'white' : category.color} 
            />
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === category.id ? 'white' : category.color }
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  const renderFeaturedEvent = ({ item }: { item: Event }) => {
    return (
      <TouchableOpacity style={styles.featuredCard}>
        <Image source={{ uri: item.image }} style={styles.featuredImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)'] as const}
          style={styles.featuredOverlay}
        >
          <View style={styles.featuredContent}>
            <View style={styles.featuredDate}>
              <Text style={styles.featuredDateText}>{item.date.split(' ')[0]}</Text>
              <Text style={styles.featuredMonthText}>{item.date.split(' ')[1]}</Text>
            </View>
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.featuredMeta}>
                <Ionicons name="location" size={14} color="white" />
                <Text style={styles.featuredLocation}>{item.location}</Text>
              </View>
              <View style={styles.featuredMeta}>
                <Ionicons name="time" size={14} color="white" />
                <Text style={styles.featuredTime}>{item.time}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  const renderEventCard = ({ item }: { item: Event }) => {
    const categoryColor = categories.find(cat => cat.id === item.category)?.color || '#FF9500';
    
    return (
      <TouchableOpacity style={styles.eventCard}>
        <Image source={{ uri: item.image }} style={styles.eventImage} />
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <View style={styles.eventDateContainer}>
              <Text style={[styles.eventDay, { color: categoryColor }]}>
                {item.date.split(' ')[0]}
              </Text>
              <Text style={styles.eventMonth}>{item.date.split(' ')[1]}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={[styles.eventTitle, { color: textColor }]} numberOfLines={2}>
                {item.title}
              </Text>
              {item.subtitle && (
                <Text style={styles.eventSubtitle}>{item.subtitle}</Text>
              )}
              <View style={styles.eventMeta}>
                <View style={styles.eventMetaItem}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.eventMetaText}>{item.time}</Text>
                </View>
                <View style={styles.eventMetaItem}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.eventMetaText}>{item.location}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.eventFooter}>
            <View style={styles.attendeesInfo}>
              <Ionicons name="people" size={16} color="#666" />
              <Text style={styles.attendeesText}>
                {item.attendees} {item.maxAttendees ? `/ ${item.maxAttendees}` : ''} participants
              </Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.registerButton,
                { backgroundColor: item.isRegistered ? '#FF8C42' : categoryColor }
              ]}
              onPress={() => toggleRegistration(item.id)}
            >
              <Ionicons 
                name={item.isRegistered ? "checkmark" : "add"} 
                size={16} 
                color="white" 
              />
              <Text style={styles.registerButtonText}>
                {item.isRegistered ? 'Inscrit' : 'S\'inscrire'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={['#FF9500', '#FF6B35'] as const}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Événements à venir</Text>
                <Text style={styles.headerSubtitle}>Découvrez et participez à nos activités communautaires</Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{events.length}</Text>
                <Text style={styles.statLabel}>Événements</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{events.filter(e => e.isRegistered).length}</Text>
                <Text style={styles.statLabel}>Mes inscriptions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{events.reduce((sum, e) => sum + e.attendees, 0)}</Text>
                <Text style={styles.statLabel}>Participants</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
        
        {/* Category Filter */}
        {renderCategoryFilter()}
        
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <View style={styles.featuredSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Événements phares</ThemedText>
            <FlatList
              data={featuredEvents}
              renderItem={renderFeaturedEvent}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        )}
        
        {/* All Events */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Tous les événements</ThemedText>
            <TouchableOpacity>
              <Text style={[styles.filterText, { color: tintColor }]}>Filtrer</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredEvents}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.eventsList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Cri de Midi',
    subtitle: 'Temps de prière et de louange',
    date: '29 Lun',
    time: '12:00 - 13:00',
    location: 'Église principale',
    description: 'Un moment de recueillement et de prière au cœur de la journée.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
    category: 'worship',
    attendees: 45,
    maxAttendees: 100,
    isRegistered: false,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Soirée de Noël',
    subtitle: 'Célébration Cap-Haïtien',
    date: '30 Mar',
    time: '19:00 - 22:00',
    location: 'Salle communautaire',
    description: 'Une soirée festive pour célébrer la naissance de Jésus ensemble.',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=200&fit=crop',
    category: 'special',
    attendees: 120,
    maxAttendees: 150,
    isRegistered: true,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Retraite Cellule',
    subtitle: 'Port-Au-Prince',
    date: '15 Jan',
    time: '09:00 - 17:00',
    location: 'Centre de retraite',
    description: 'Une journée de ressourcement spirituel et de communion fraternelle.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    category: 'retreat',
    attendees: 35,
    maxAttendees: 50,
    isRegistered: false,
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Culte des Jeunes',
    subtitle: 'Génération nouvelle',
    date: '05 Fév',
    time: '18:30 - 20:30',
    location: 'Salle des jeunes',
    description: 'Un culte dynamique spécialement conçu pour la jeunesse.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=200&fit=crop',
    category: 'youth',
    attendees: 80,
    maxAttendees: 120,
    isRegistered: true,
    isFeatured: false,
  },
  {
    id: '5',
    title: 'Conférence Familiale',
    subtitle: 'Construire des foyers solides',
    date: '20 Mar',
    time: '14:00 - 18:00',
    location: 'Auditorium principal',
    description: 'Des enseignements pratiques pour fortifier les liens familiaux.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=200&fit=crop',
    category: 'community',
    attendees: 95,
    maxAttendees: 200,
    isRegistered: false,
    isFeatured: false,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    maxWidth: '80%',
    lineHeight: 20,
  },
  searchButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 10,
  },
  categoryScrollView: {
    marginVertical: 20,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingBottom: 4
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  featuredSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: width * 0.8,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  featuredDate: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 16,
  },
  featuredDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  featuredMonthText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  featuredInfo: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
  },
  featuredTime: {
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
  },
  eventsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventsList: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eventImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  eventDateContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventMonth: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  eventMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  registerButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
});