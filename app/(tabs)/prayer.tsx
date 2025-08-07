import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
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

const { width, height } = Dimensions.get('window');

interface PrayerCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface PrayerRequest {
  id: string;
  category: string;
  message: string;
  isAnonymous: boolean;
  timestamp: Date;
  status: 'pending' | 'praying' | 'answered';
}

export default function PrayerScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [prayerMessage, setPrayerMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentPrayers, setRecentPrayers] = useState<PrayerRequest[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  const prayerCategories: PrayerCategory[] = [
    { id: 'health', name: 'Santé', icon: 'medical', color: '#FF9500' },
    { id: 'family', name: 'Famille', icon: 'people', color: '#FF6B35' },
    { id: 'work', name: 'Travail', icon: 'briefcase', color: '#FF8C42' },
    { id: 'finances', name: 'Finances', icon: 'card', color: '#FFB366' },
    { id: 'relationships', name: 'Relations', icon: 'heart', color: '#FF9500' },
    { id: 'spiritual', name: 'Spirituel', icon: 'book', color: '#FF6B35' },
    { id: 'emergency', name: 'Urgence', icon: 'warning', color: '#FF4500' },
    { id: 'gratitude', name: 'Gratitude', icon: 'happy', color: '#FF8C42' },
  ];
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleSubmitPrayer = async () => {
    if (!selectedCategory || !prayerMessage.trim()) {
      Alert.alert('Champs requis', 'Veuillez sélectionner une catégorie et saisir votre demande de prière.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPrayer: PrayerRequest = {
        id: Date.now().toString(),
        category: selectedCategory,
        message: prayerMessage,
        isAnonymous,
        timestamp: new Date(),
        status: 'pending'
      };
      
      setRecentPrayers(prev => [newPrayer, ...prev.slice(0, 4)]);
      setPrayerMessage('');
      setSelectedCategory('');
      setIsAnonymous(false);
      setIsSubmitting(false);
      
      Alert.alert(
        'Prière envoyée',
        'Votre demande de prière a été envoyée à notre communauté. Nous prierons pour vous.',
        [{ text: 'Amen', style: 'default' }]
      );
    }, 1500);
  };
  
  const getCategoryById = (id: string) => {
    return prayerCategories.find(cat => cat.id === id);
  };
  
  const renderCategoryGrid = () => {
    return (
      <View style={styles.categoriesContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Choisir une catégorie</ThemedText>
        <View style={styles.categoriesGrid}>
          {prayerCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && {
                  borderColor: category.color,
                  borderWidth: 2,
                  backgroundColor: `${category.color}15`
                }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon} size={20} color="white" />
              </View>
              <Text style={[styles.categoryName, { color: textColor }]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  const renderRecentPrayers = () => {
    if (recentPrayers.length === 0) return null;
    
    return (
      <View style={styles.recentPrayersContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Mes demandes récentes</ThemedText>
        {recentPrayers.map((prayer) => {
          const category = getCategoryById(prayer.category);
          return (
            <View key={prayer.id} style={styles.prayerCard}>
              <View style={styles.prayerHeader}>
                <View style={styles.prayerCategoryInfo}>
                  {category && (
                    <View style={[styles.prayerCategoryIcon, { backgroundColor: category.color }]}>
                      <Ionicons name={category.icon} size={16} color="white" />
                    </View>
                  )}
                  <Text style={[styles.prayerCategoryText, { color: textColor }]}>
                    {category?.name || 'Général'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(prayer.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(prayer.status)}</Text>
                </View>
              </View>
              <Text style={[styles.prayerText, { color: textColor }]} numberOfLines={2}>
                {prayer.message}
              </Text>
              <Text style={styles.prayerTime}>
                {prayer.timestamp.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
                  <Text style={styles.headerTitle}>Demandes de Prière</Text>
                </View>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>127</Text>
                  <Text style={styles.statLabel}>Prières actives</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>89</Text>
                  <Text style={styles.statLabel}>Exaucées</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>456</Text>
                  <Text style={styles.statLabel}>Communauté</Text>
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
          
          {/* Prayer Form */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Ionicons name="add-circle" size={24} color={tintColor} />
              <Text style={[styles.formTitle, { color: textColor }]}>Nouvelle demande</Text>
            </View>
            
            {renderCategoryGrid()}
            
            {/* Prayer Message Input */}
            <View style={styles.messageContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Votre demande de prière*</ThemedText>
              <Text style={styles.messageHint}>
                Décrivez votre situation ou votre besoin de prière avec vos propres mots
              </Text>
              <TextInput
                style={[styles.messageInput, { color: textColor, borderColor: selectedCategory ? getCategoryById(selectedCategory)?.color : '#E5E5E5' }]}
                placeholder="Partagez votre cœur avec notre communauté..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                value={prayerMessage}
                onChangeText={setPrayerMessage}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>{prayerMessage.length}/500</Text>
            </View>
            
            {/* Privacy Options */}
            <View style={styles.privacyContainer}>
              <TouchableOpacity 
                style={styles.privacyOption}
                onPress={() => setIsAnonymous(!isAnonymous)}
              >
                <View style={[styles.checkbox, isAnonymous && styles.checkboxChecked]}>
                  {isAnonymous && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text style={[styles.privacyText, { color: textColor }]}>Demande anonyme</Text>
              </TouchableOpacity>
              <Text style={styles.privacyHint}>
                Votre nom ne sera pas visible par la communauté
              </Text>
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, (!selectedCategory || !prayerMessage.trim()) && styles.submitButtonDisabled]}
              onPress={handleSubmitPrayer}
              disabled={isSubmitting || !selectedCategory || !prayerMessage.trim()}
            >
              <LinearGradient
                colors={(!selectedCategory || !prayerMessage.trim()) ? ['#ccc', '#999'] : ['#FF9500', '#FF6B35'] as const}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isSubmitting ? (
                  <View style={styles.submitButtonContent}>
                    <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate: '45deg' }] }]}>
                      <Ionicons name="refresh" size={20} color="white" />
                    </Animated.View>
                    <Text style={styles.submitButtonText}>Envoi en cours...</Text>
                  </View>
                ) : (
                  <View style={styles.submitButtonContent}>
                    <Ionicons name="send" size={20} color="white" />
                    <Text style={styles.submitButtonText}>Envoyer ma demande</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {renderRecentPrayers()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending': return '#FF9500';
    case 'praying': return '#FF6B35';
    case 'answered': return '#FF8C42';
    default: return '#FFB366';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'pending': return 'En attente';
    case 'praying': return 'En prière';
    case 'answered': return 'Exaucée';
    default: return 'Inconnu';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF9500',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  formContainer: {
    padding: 20,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
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
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 24,
  },
  messageHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  messageInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  privacyContainer: {
    marginBottom: 24,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF9500',
    borderColor: '#FF9500',
  },
  privacyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  privacyHint: {
    fontSize: 12,
    color: '#666',
    marginLeft: 32,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingSpinner: {
    marginRight: 8,
  },
  recentPrayersContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  prayerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prayerCategoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerCategoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  prayerCategoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  prayerText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  prayerTime: {
    fontSize: 12,
    color: '#999',
  },
});